import { RequestHandler, ParamsDictionary } from 'express-serve-static-core';
import BadRequest from '../errors/BadRequest';

const uuidRegex = new RegExp(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
);

const defaultOptions: Options = {
  whitelist: [],
};

export const uuidParamValidator = <
  P extends ParamsDictionary,
  ResBody,
  ReqBody
>(
  options?: Partial<Options>,
): RequestHandler<P, ResBody, ReqBody> => async (req, res, next) => {
  const paramOptions: Options = { ...defaultOptions, ...options };

  const params = Object.keys(req.params);

  const filteredParams = params.filter(
    param => !paramOptions.whitelist.includes(param),
  );

  const isError = filteredParams.some(
    param => !uuidRegex.test(req.params[param]),
  );

  if (isError) {
    next(new BadRequest('invalid uuid'));
    return;
  }

  next();
};

interface Options {
  whitelist: string[];
}
