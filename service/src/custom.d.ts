declare namespace Express {
  export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }

  export interface UserAuth {
    id?: string;
    roles: Role[];
  }

  export interface Request {
    user?: UserAuth;
  }
}
