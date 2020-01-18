import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validateOrReject } from 'class-validator';
import { Params, RequestHandler } from 'express-serve-static-core';

export const requestValidator = <P extends Params, ResBody, ReqBody>(
  validator: ClassType<object>,
): RequestHandler<P, ResBody, ReqBody> => async (req, res, next) => {
  const validatorInstance = plainToClass(validator, req.body);

  return validateOrReject(validatorInstance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  })
    .then(next)
    .catch(next);
};
