import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { Service } from 'typedi';
import NotAuthorized from '../errors/NotAuthorized';
import User from '../users/entities/users.entity';
import UserRepository from '../users/users.repository';
import LoginRequest from './models/LoginRequest.dto';

@Service()
class AuthService {
  constructor(private repository: UserRepository) {}

  login = async (loginRequest: LoginRequest): Promise<User> => {
    const user = await this.repository.findUserByUsername(
      loginRequest.username,
    );

    if (!user) {
      throw new NotAuthorized();
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password ?? '',
    );

    if (!isValidPassword) {
      throw new NotAuthorized();
    }

    return classToPlain(user) as User;
  };
}

export default AuthService;
