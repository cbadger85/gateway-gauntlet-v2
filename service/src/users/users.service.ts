import bcrypt from 'bcryptjs';
import { classToPlain, plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import uuid from 'uuid/v4';
import BadRequest from '../errors/BadRequest';
import Forbidden from '../errors/Forbidden';
import NotFound from '../errors/NotFound';
import User from './entities/users.entity';
import AddUserRequest from './models/AddUserRequest.dto';
import UserRepository from './users.repository';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = async (user: AddUserRequest): Promise<User> => {
    const existingUsers = await this.repository.countUsersByUsernameOrEmail(
      user.username,
      user.email,
    );

    if (existingUsers) {
      throw new BadRequest('User already exists');
    }

    const sessionId = uuid();
    const passwordExpiration = new Date(Date.now() + 3600000);

    const savedUser = await this.repository.saveUser(
      plainToClass(User, { ...user, passwordExpiration, sessionId }),
    );

    // TODO: call email service and send new user email.

    return classToPlain(savedUser) as User;
  };

  // TODO: add request body to this and validate email
  requestResetPassword = async (email: string): Promise<void> => {
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
      return;
    }

    user.passwordExpiration = new Date(Date.now() + 3600000);

    // TODO: call email service and send reset password email;

    this.repository.saveUser(user);
  };

  disableAccount = async (id: string): Promise<void> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    user.sessionId = undefined;

    this.repository.saveUser(user);
  };

  resetPassword = async (id: string, password: string): Promise<void> => {
    const user = await this.repository.findUser(id);

    if (
      !user?.passwordExpiration ||
      user.passwordExpiration < new Date(Date.now())
    ) {
      throw new Forbidden();
    }

    user.password = await bcrypt.hash(password, 10);

    this.repository.saveUser(user);
  };

  getUser = async (id: string): Promise<User> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    return classToPlain(user) as User;
  };
}

export default UserService;
