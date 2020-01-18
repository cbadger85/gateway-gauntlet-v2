import { validate, ValidationError } from 'class-validator';
import { Params, RequestHandler } from 'express-serve-static-core';
import HttpError from '../errors/HttpError';

type Entity = {
  [key: string]: unknown;
  of: Function;
};

const hasOf = (obj: unknown): obj is Entity =>
  typeof obj === 'function' && Object.getOwnPropertyNames(obj).includes('of');

export const requestValidator = <P extends Params, ResBody, ReqBody>(
  validator: unknown,
): RequestHandler<P, ResBody, ReqBody> => async (req, res, next) => {
  if (!hasOf(validator)) {
    return next(new HttpError('Invalid validator'));
  }

  const validatorInstance = validator.of(req.body);

  const requestFields = Object.keys(req.body);
  const validatorFields = Object.keys(validatorInstance);

  const invalidFieldErrors = requestFields
    .filter(field => !validatorFields.includes(field))
    .map(invalidField => {
      const error = new ValidationError();
      error.constraints = {
        invalidField: `${invalidField} is not a valid field`,
      };
      return error;
    });

  const validationErrors = await validate(validatorInstance);

  if (invalidFieldErrors.length || validationErrors.length) {
    return next([...invalidFieldErrors, ...validationErrors]);
  }

  next();
};
