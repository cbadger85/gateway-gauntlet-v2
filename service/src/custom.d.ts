declare namespace Express {
  export interface Request {
    user?: import('./auth/models/UserAuth').UserAuth;
  }
}
