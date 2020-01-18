import {
  Params,
  RequestHandler,
  ErrorRequestHandler,
  ParamsDictionary,
} from 'express-serve-static-core';
import HttpError from '../errors/HttpError';
import { ValidationError } from 'class-validator';

export const asyncHandler = <P extends Params, ResBody, ReqBody>(
  handler: RequestHandler<P, ResBody, ReqBody>,
): RequestHandler<P, ResBody, ReqBody> => (req, res, next) =>
  handler(req, res, next).catch(next);

export const validationErrorHandler: ErrorRequestHandler<
  ParamsDictionary,
  unknown,
  {}
> = (errors: ValidationError[], req, res, next) => {
  if (
    !Array.isArray(errors) ||
    !errors.every(e => e instanceof ValidationError)
  ) {
    next(errors);
  }

  const errorMessage = errors.reduce<string[]>(
    (acc, error) => [...acc, ...Object.values(error.constraints)],
    [],
  );
  res.status(400).json({ errors: errorMessage });
};

export const errorHandler: ErrorRequestHandler<
  ParamsDictionary,
  ErrorDto,
  {}
> = ({ name, message, statusCode }: HttpError, req, res, next) => {
  res.status(statusCode || 500).json({ name, message, statusCode });
};

interface ErrorDto {
  statusCode?: number;
  name: string;
  message: string;
}

export default [validationErrorHandler, errorHandler];
