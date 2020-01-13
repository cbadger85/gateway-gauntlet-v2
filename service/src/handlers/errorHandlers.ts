import { Params, RequestHandler } from 'express-serve-static-core';

export const asyncHandler = <P extends Params, ResBody, ReqBody>(
  handler: RequestHandler<P, ResBody, ReqBody>,
): RequestHandler<P, ResBody, ReqBody> => (req, res, next) =>
  handler(req, res, next).catch(next);
