import {
  Params,
  RequestHandler,
  ErrorRequestHandler,
  ParamsDictionary,
} from 'express-serve-static-core';
import HttpError from '../errors/HttpError';

export const asyncHandler = <P extends Params, ResBody, ReqBody>(
  handler: RequestHandler<P, ResBody, ReqBody>,
): RequestHandler<P, ResBody, ReqBody> => (req, res, next) =>
  handler(req, res, next).catch(next);

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
