import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import { UserResponse } from './models/UserResponse.dto';
import UserRepository from './users.repository';
import { Role } from '../auth/models/Role';
import AddUserRequest from './models/AddUserRequest.dto';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  private transformRolesToString = (roles: Role[]): string => roles.join(',');

  private transformStringToRoles = (roles: string): Role[] =>
    roles.split(',') as Role[];

  addUser = async (user: AddUserRequest): Promise<UserResponse> => {
    const password = await bcrypt.hash(user.password, 10);

    const newUser = {
      ...user,
      password,
      roles: this.transformRolesToString(user.roles),
    };

    const { id, username, roles } = await this.repository.saveUser(newUser);

    return {
      username,
      id,
      roles: this.transformStringToRoles(roles),
    };
  };

  getUser = async (id: number): Promise<UserResponse | undefined> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    return {
      username: user.username,
      id: user.id,
      roles: this.transformStringToRoles(user.roles),
    };
  };
}

export default UserService;
