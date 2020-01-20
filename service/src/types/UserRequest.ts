import { Express } from 'express-serve-static-core';
import { UserAuth } from '../auth/models/UserAuth';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserAuth;
  }
}
