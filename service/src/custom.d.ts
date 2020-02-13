declare namespace Express {
  export interface Request {
    user?: import('./users/users.entity').default;
  }
}
