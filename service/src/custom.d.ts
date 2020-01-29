declare namespace Express {
  export interface Request {
    user?: import('./users/entities/users.entity').default;
  }
}
