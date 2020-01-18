import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import {
  transformRolesToString,
  transformStringToRoles,
} from '../utils/roleTransformers';
import AddUserRequest from './models/AddUserRequest.dto';
import { UserResponse } from './models/UserResponse.dto';
import UserRepository from './users.repository';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = async (user: AddUserRequest): Promise<UserResponse> => {
    const password = await bcrypt.hash(user.password, 10);

    const newUser = {
      ...user,
      password,
      roles: transformRolesToString(user.roles),
    };

    const { id, username, roles } = await this.repository.saveUser(newUser);

    return {
      username,
      id,
      roles: transformStringToRoles(roles),
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
      roles: transformStringToRoles(user.roles),
    };
  };
}

export default UserService;
