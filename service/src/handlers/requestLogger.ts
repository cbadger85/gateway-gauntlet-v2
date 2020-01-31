import { RequestHandler } from 'express-serve-static-core';

export const requestLogger: RequestHandler = (req, res, next) => {
  console.log(req.method, req.path);
  next();
};
