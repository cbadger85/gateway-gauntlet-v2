export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  firstName: string;
  lastName: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORGANIZER = 'ORGANIZER',
}
