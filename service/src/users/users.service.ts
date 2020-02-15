import bcrypt from 'bcryptjs';
import { classToPlain, plainToClass } from 'class-transformer';
import { Service } from 'typedi';
import uuid from 'uuid/v4';
import EmailService from '../email/email.service';
import BadRequest from '../errors/BadRequest';
import NotFound from '../errors/NotFound';
import User from './users.entity';
import UpsertUserRequest from './UpsertUserRequest.dto';
import UserRepository from './users.repository';
import shortid from 'shortid';
import { getEmojiLog } from '../utils/getEmojiLog';
import NotAuthorized from '../errors/NotAuthorized';

@Service()
class UserService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService,
  ) {}

  addUser = async (newUser: UpsertUserRequest): Promise<User> => {
    console.log(getEmojiLog('👤', 'Creating new user...'));
    const [, existingUsers] = await this.repository.countUsersByUsernameOrEmail(
      newUser.username,
      newUser.email,
    );

    if (existingUsers) {
      console.log(getEmojiLog('🚫', 'User creation failed!'));
      throw new BadRequest('Username or email already exists');
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

    console.log(getEmojiLog('🙌', 'User created!'), `ID: ${savedUser.id}`);
    return classToPlain(savedUser) as User;
  };

  updateUser = async (
    userId: string,
    updatedUser: UpsertUserRequest,
  ): Promise<User> => {
    console.log(getEmojiLog('👤', 'Updating user...'));

    const user = await this.repository.findUser(userId);

    if (!user) {
      console.log(getEmojiLog('🚫', 'User updating failed!'));
      throw new NotFound('User does not exist');
    }

    const [existingUsers] = await this.repository.countUsersByUsernameOrEmail(
      updatedUser.username,
      updatedUser.email,
    );

    const isExistingUser = existingUsers.every(user => userId === user.id);

    if (!isExistingUser) {
      console.log(getEmojiLog('🚫', 'User creation failed!'));
      throw new BadRequest('Username or email already exists');
    }

    const savedUser = await this.repository.saveUser(
      plainToClass(User, { ...user, ...updatedUser }),
    );

    console.log(getEmojiLog('🙌', 'User updated!'), `ID: ${savedUser.id}`);
    return classToPlain(savedUser) as User;
  };

  disableAccount = async (id: string): Promise<void> => {
    console.log(getEmojiLog('🔐', 'Disabling user account...'), `ID: ${id}`);
    const user = await this.repository.findUser(id);

    if (!user) {
      console.log(getEmojiLog('🚫', 'Disabling account failed!'));
      throw new NotFound('user not found');
    }

    user.sessionId = null;

    console.log(getEmojiLog('🙌', 'User account disabled!'), `ID: ${user.id}`);
    await this.repository.saveUser(user);
  };

  enableAccount = async (id: string): Promise<void> => {
    console.log(getEmojiLog('🔓', 'Enabling user account...'), `ID: ${id}`);
    const user = await this.repository.findUser(id);

    if (!user) {
      console.log(getEmojiLog('🚫', 'Enabling account failed!'));
      throw new NotFound('user not found');
    }

    user.sessionId = uuid();

    await this.repository.saveUser(user);
  };

  resetForgottenPassword = async (
    userId: string,
    passwordResetId: string,
    password: string,
  ): Promise<void> => {
    console.log(getEmojiLog('👤', 'Resetting forgotten password...'));
    const user = await this.repository.findUser(userId);

    if (
      !user?.passwordExpiration ||
      user.passwordExpiration < new Date(Date.now()) ||
      passwordResetId !== user.passwordResetId
    ) {
      console.log(
        getEmojiLog('🚫', 'Resetting password failed!'),
        `User doesn't exist, password expiration doesn't exist or is past, or reset id doesn't exist. ID: ${user?.id}`,
      );
      throw new NotAuthorized();
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordExpiration = null;

    await this.repository.saveUser(user);

    console.log(
      getEmojiLog('🙌', 'password successfully changed!'),
      `ID: ${user.id}`,
    );
  };

  getUser = async (id: string): Promise<User> => {
    console.log(getEmojiLog('👤', 'Retrieving user...'), `ID: ${id}`);
    const user = await this.repository.findUser(id);

    if (!user) {
      console.log(getEmojiLog('🚫', 'Retrieving user failed!'));
      throw new NotFound('user not found');
    }

    console.log(getEmojiLog('🙌', 'Found user!'), `ID: ${user.id}`);
    return classToPlain(user) as User;
  };

  getAllUsers = async (): Promise<User[]> => {
    console.log(getEmojiLog('👤👤👤', 'Retrieving user list...'));
    return (await this.repository.findAllUsers()).map<User>(
      user => classToPlain(user) as User,
    );
  };

  changePassword = async (id: string, password: string): Promise<void> => {
    console.log(getEmojiLog('🔏', 'User changing password...'));
    const user = await this.repository.findUser(id);

    if (!user) {
      console.log(getEmojiLog('🚫', 'Failed to change user password!'));
      throw new NotFound('user not found');
    }

    user.password = await bcrypt.hash(password, 10);

    console.log(
      getEmojiLog('🙌', 'User password successfullly changed!'),
      `ID: ${user.id}`,
    );
    this.repository.saveUser(user);
  };
}

export default UserService;
