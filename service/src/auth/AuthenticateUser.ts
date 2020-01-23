import { Params, RequestHandler } from 'express-serve-static-core';
import Forbidden from '../errors/Forbidden';
import { Role } from './models/Role';

class AuthenticatedUser<P extends Params, ReqBody> {
  private constructor(
    private config: RbacConfig,
    private operation = '*',
    private has?: () =>
      | Record<string, unknown>
      | Promise<Record<string, unknown>>,
  ) {}

  static of = <P extends Params, ReqBody>(
    config: RbacConfig,
  ): AuthenticatedUser<P, ReqBody> => new AuthenticatedUser(config);

  can = (
    operation: string,
  ): { done: DoneFn<P, ReqBody>; when: WhenFn<P, ReqBody> } => {
    this.operation = operation;
    return { done: this.done, when: this.when };
  };

  private when = (
    has: () => Record<string, unknown> | Promise<Record<string, unknown>>,
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
          : await this.isAllowed(role, id, this.operation, this.has),
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
    operation: string,
    has?: () => Record<string, unknown> | Promise<Record<string, unknown>>,
  ): Promise<boolean> => {
    if (!has) {
      return false;
    }

    const requiredOp = this.config[role].can.find(
      op => this.isCanObj(op) && op.name === operation,
    );

    const params = { ...(await has()), userId };

    if (requiredOp && this.isCanObj(requiredOp) && requiredOp.where(params)) {
      return true;
    }

    return !!this.config[role].inherits?.some(role =>
      this.isAllowed(role, userId, operation, has),
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

export default AuthenticatedUser;

export type HasFn<R extends Record<string, unknown>> = () => R | Promise<R>;

type DoneFn<P extends Params, ReqBody> = () => RequestHandler<
  P,
  never,
  ReqBody
>;

type WhenFn<P extends Params, ReqBody> = (
  has: HasFn<Record<string, unknown>>,
) => { done: DoneFn<P, ReqBody> };

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
      where: (params: Record<string, unknown> & { userId: string }) => boolean;
    };
