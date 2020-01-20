import { Params, RequestHandler } from 'express-serve-static-core';
import HttpError from '../errors/HttpError';

export const serverTimout = <P extends Params, ResBody, ReqBody>(
  time = 120000,
): RequestHandler<P, ResBody, ReqBody> => (req, res, next): void => {
  res.setTimeout(time, function() {
    console.log('⏰'.padEnd(4), 'Request has timed out.');
    next(new HttpError('Server has timed out'));
  });

  next();
};
