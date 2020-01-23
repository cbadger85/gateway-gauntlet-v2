import { Params, RequestHandler } from 'express-serve-static-core';
import Forbidden from '../errors/Forbidden';
import { Role } from './models/Role';

class AuthenticateUser<P extends Params, R> {
  private constructor(
    private config: RbacConfig,
    private operation = '*',
    private has?: (params: P) => R | Promise<R>,
  ) {}

  static of = <P extends Params, R>(
    config: RbacConfig,
  ): AuthenticateUser<P, R> => new AuthenticateUser(config);

  can = (operation: string): { done: DoneFn<P>; when: WhenFn<P, R> } => {
    this.operation = operation;
    return { done: this.done, when: this.when };
  };

  private when = (has: (params: P) => R | Promise<R>): { done: DoneFn<P> } => {
    this.has = has;
    return { done: this.done };
  };

  done = (): RequestHandler<P, never, unknown> => async (
    req,
    res,
    next,
  ): Promise<void> => {
    if (!req.user) {
      return next(new Forbidden());
    }

    const { roles, id } = req.user;
    const { params } = req;

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
          : await this.isAllowed(role, id, params, this.operation, this.has),
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

    return !!this.config[role].inherits?.some(role =>
      this.hasOperation(role, operation),
    );
  };

  private isAllowed = async (
    role: Role,
    userId: string,
    params: P,
    operation: string,
    has?: (params: P) => R | Promise<R>,
  ): Promise<boolean> => {
    if (!has) {
      return false;
    }

    const requiredOp = this.config[role].can.find(
      op => this.isCanObj(op) && op.name === operation,
    );

    const providedParams = { ...(await has(params)), userId, params };

    if (
      requiredOp &&
      this.isCanObj(requiredOp) &&
      requiredOp.where(providedParams)
    ) {
      return true;
    }

    const isAllowed = await this.config[role].inherits?.reduce<
      Promise<boolean>
    >(
      async (acc, role) =>
        (await acc)
          ? true
          : await this.isAllowed(
              role,
              userId,
              params,
              this.operation,
              this.has,
            ),
      Promise.resolve(false),
    );

    return !!isAllowed;
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

type DoneFn<P extends Params> = () => RequestHandler<P, never, unknown>;

type WhenFn<P extends Params, R> = (has: HasFn<P, R>) => { done: DoneFn<P> };

export type Where = {
  where: <T>(params: Record<string, unknown> & T) => boolean;
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
      where: (
        params: Record<string, unknown> & {
          userId: string;
        },
      ) => boolean;
    };
