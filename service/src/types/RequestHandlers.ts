import {
  NextFunction,
  Params,
  ParamsDictionary,
  Request,
  Response,
} from 'express-serve-static-core';

export interface UserReq<P extends Params, ResBody, ReqBody>
  extends Request<P, ResBody, ReqBody> {
  user: string;
}

export interface UserRequestHandler<
  P extends Params = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown
> {
  (
    req: UserReq<P, ResBody, ReqBody>,
    res: Response<ResBody>,
    next: NextFunction,
  ): void;
}
