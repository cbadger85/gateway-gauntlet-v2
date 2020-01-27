import bcrypt from 'bcryptjs';
import { classToPlain, plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import uuid from 'uuid/v4';
import EmailService from '../email/email.service';
import BadRequest from '../errors/BadRequest';
import Forbidden from '../errors/Forbidden';
import NotFound from '../errors/NotFound';
import User from './entities/users.entity';
import AddUserRequest from './models/AddUserRequest.dto';
import UserRepository from './users.repository';
import shortid from 'shortid';

@Service()
class UserService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService,
  ) {}

  addUser = async (newUser: AddUserRequest): Promise<User> => {
    const existingUsers = await this.repository.countUsersByUsernameOrEmail(
      newUser.username,
      newUser.email,
    );

    if (existingUsers) {
      throw new BadRequest('User already exists');
    }

    const sessionId = uuid();
    const passwordExpiration = new Date(Date.now() + 3600000);
    const passwordResetId = shortid();

    const savedUser = await this.repository.saveUser(
      plainToClass(User, {
        ...newUser,
        passwordExpiration,
        passwordResetId,
        sessionId,
      }),
    );

    this.emailService.sendNewUserEmail(savedUser);

    return classToPlain(savedUser) as User;
  };

  disableAccount = async (id: string): Promise<void> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    user.sessionId = undefined;

    this.repository.saveUser(user);
  };

  resetPassword = async (
    userId: string,
    passwordResetId: string,
    password: string,
  ): Promise<void> => {
    const user = await this.repository.findUser(userId);

    if (
      !user?.passwordExpiration ||
      user.passwordExpiration < new Date(Date.now()) ||
      passwordResetId !== user.passwordResetId
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

  getAllUsers = async (): Promise<User[]> =>
    await this.repository.findAllUsers();

  changePassword = async (id: string, password: string): Promise<void> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    user.password = await bcrypt.hash(password, 10);

    this.repository.saveUser(user);
  };
}

export default UserService;
