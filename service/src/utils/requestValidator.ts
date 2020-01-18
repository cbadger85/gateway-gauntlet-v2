import { Params, RequestHandler } from 'express-serve-static-core';
import { validateOrReject } from 'class-validator';
import HttpError from '../errors/HttpError';

type Entity = {
  [key: string]: unknown;
  of: Function;
};

const hasOf = (obj: unknown): obj is Entity =>
  typeof obj === 'function' && Object.getOwnPropertyNames(obj).includes('of');

export const requestValidator = <P extends Params, ResBody, ReqBody>(
  entity: unknown,
): RequestHandler<P, ResBody, ReqBody> => async (req, res, next) => {
  if (!hasOf(entity)) {
    return next(new HttpError('Invalid validator'));
  }

  return validateOrReject(entity.of(req.body))
    .then(next)
    .catch(next);
};
