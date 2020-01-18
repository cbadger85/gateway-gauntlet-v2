import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotAuthorized from '../errors/NotAuthorized';
import { UserResponse } from '../users/models/UserResponse.dto';
import UserRepository from '../users/users.repository';
import { transformStringToRoles } from '../utils/roleTransformers';
import LoginRequest from './models/LoginRequest.dto';

@Service()
class AuthService {
  constructor(private repository: UserRepository) {}

  login = async (
    userId: number,
    loginRequest: LoginRequest,
  ): Promise<UserResponse> => {
    const user = await this.repository.findUser(userId);

    if (!user) {
      throw new NotAuthorized();
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new NotAuthorized();
    }

    return {
      id: user.id,
      username: user.username,
      roles: transformStringToRoles(user.roles),
    };
  };
}

export default AuthService;
