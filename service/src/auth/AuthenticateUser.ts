import { Params, RequestHandler } from 'express-serve-static-core';
import Forbidden from '../errors/Forbidden';
import { Role } from './models/Role';

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

    const { roles, id } = req.user;
    const { params, body } = req;

    const hasOperation = roles.some(role =>
      this.hasOperation(role, this.operation),
    );

    if (hasOperation) {
      return next();
    }

    const isAllowed = await roles.reduce<Promise<boolean>>(
      async (acc, role) =>
        (await acc)
          ? true
          : await this.isAllowed(
              role,
              id,
              params,
              body,
              this.operation,
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
    userId: string,
    params: P,
    body: ReqBody,
    operation: string,
    has?: (params: P) => R | Promise<R>,
  ): Promise<boolean> => {
    if (!has) {
      return false;
    }

    const requiredOp = this.config[role].can.find(
      op => this.isCanObj(op) && op.name === operation,
    );

    const providedParams = { ...(await has(params)), params, body };

    if (
      requiredOp &&
      this.isCanObj(requiredOp) &&
      requiredOp.where(userId, providedParams)
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
              userId,
              params,
              body,
              this.operation,
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
  where: <P, ReqBody>(userId: string, params: P) => boolean;
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
      where: (userId: string, params: Record<string, unknown>) => boolean;
    };
