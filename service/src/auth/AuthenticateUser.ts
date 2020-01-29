import { Params, RequestHandler } from 'express-serve-static-core';
import Forbidden from '../errors/Forbidden';
import { Role } from './models/Role';
import User from '../users/entities/users.entity';

class AuthenticateUser<P extends Params, ReqBody, R> {
  private constructor(
    private config: RbacConfig,
    private operation = '*',
    private has?: (params: P) => R | Promise<R>,
  ) {}

  static of = <P extends Params, ReqBody, R>(
    config: RbacConfig,
  ): AuthenticateUser<P, ReqBody, R> => new AuthenticateUser(config);

  can = (
    operation: string,
  ): { done: DoneFn<P, ReqBody>; when: WhenFn<P, ReqBody, R> } => {
    this.operation = operation;
    return { done: this.done, when: this.when };
  };

  private when = (
    has: (params: P) => R | Promise<R>,
  ): { done: DoneFn<P, ReqBody> } => {
    this.has = has;
    return { done: this.done };
  };

  done = (): RequestHandler<P, never, ReqBody> => async (
    req,
    res,
    next,
  ): Promise<void> => {
    if (!req.user) {
      return next(new Forbidden());
    }

    // const { roles, id } = req.user;
    const { params, body } = req;

    const hasOperation = req.user.roles.some(role =>
      this.hasOperation(role, this.operation),
    );

    if (hasOperation) {
      return next();
    }

    const isAllowed = await req.user.roles.reduce<Promise<boolean>>(
      async (acc, role) =>
        (await acc)
          ? true
          : await this.isAllowed(
              role,
              params,
              body,
              this.operation,
              req.user,
              this.has,
            ),
      Promise.resolve(false),
    );

    if (isAllowed) {
      return next();
    }

    return next(new Forbidden());
  };

  private hasOperation = (role: Role, operation: string): boolean => {
    const hasOp =
      this.config[role] && this.config[role].can.includes(this.operation);

    if (hasOp) {
      return true;
    }

    const inherits = this.config[role].inherits || [];

    return inherits.some(role => this.hasOperation(role, operation));
  };

  private isAllowed = async (
    role: Role,
    params: P,
    body: ReqBody,
    operation: string,
    user?: User,
    has?: (params: P) => R | Promise<R>,
  ): Promise<boolean> => {
    if (!user) {
      return false;
    }

    const requiredOp = this.config[role].can.find(
      op => this.isCanObj(op) && op.name === operation,
    );

    const providedParams = has ? await has(params) : {};

    if (
      requiredOp &&
      this.isCanObj(requiredOp) &&
      requiredOp.where(user, { ...providedParams }, body)
    ) {
      return true;
    }

    const inherits = this.config[role].inherits || [];

    return await inherits.reduce<Promise<boolean>>(
      async (acc, role) =>
        (await acc)
          ? true
          : await this.isAllowed(
              role,
              params,
              body,
              this.operation,
              user,
              this.has,
            ),
      Promise.resolve(false),
    );
  };

  private isCanObj = (op: unknown): op is Where => {
    const hasKeys = (op: object): op is Record<'where', unknown> =>
      'where' in op && 'name' in op;
    if (typeof op !== 'object' || !op) {
      return false;
    }

    return hasKeys(op) && typeof op.where === 'function';
  };
}

export default AuthenticateUser;

export type HasFn<P extends Params, R> = (params: P) => R | Promise<R>;

type DoneFn<P extends Params, ReqBody> = () => RequestHandler<
  P,
  never,
  ReqBody
>;

type WhenFn<P extends Params, ReqBody, R> = (
  has: HasFn<P, R>,
) => { done: DoneFn<P, ReqBody> };

export type Where = {
  where: <ReqBody, R>(user: User, params: R, body: ReqBody) => boolean;
  name: string;
};

export interface RbacConfig {
  [key: string]: {
    can: CanPermission[];
    inherits?: Role[];
  };
}

type CanPermission =
  | string
  | {
      name: string;
      where: (user: User, params: any, body: any) => boolean;
    };
