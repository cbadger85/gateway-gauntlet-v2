import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import { Service } from 'typedi';
import EmailService from '../email/email.service';
import NotAuthorized from '../errors/NotAuthorized';
import User from '../users/entities/users.entity';
import UserRepository from '../users/users.repository';
import { getEmojiLog } from '../utils/getEmojiLog';
import LoginRequest from './models/LoginRequest.dto';

@Service()
class AuthService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService,
  ) {}

  login = async (
    loginRequest: LoginRequest,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    console.log(getEmojiLog('👤', 'User attempting login...'));
    const user = await this.repository.findUserByUsername(
      loginRequest.username,
    );

    if (!user || !user.sessionId || !user.password) {
      console.log(
        getEmojiLog('🚫', 'Login failed!'),
        `User doesn't exist, or has no password or sessionId. ID: ${user?.id}`,
      );
      throw new NotAuthorized();
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isValidPassword) {
      console.log(
        getEmojiLog('🚫', 'Login failed!'),
        `User has incorrect password. ID: ${user.id}`,
      );
      throw new NotAuthorized();
    }

    const sanitizedUser = classToPlain(user) as User;
    const { id, sessionId } = user;
    const accessToken = this.getAccessToken(sanitizedUser);
    const refreshToken = this.getRefreshToken({ id, sessionId });

    console.log(getEmojiLog('🙌', 'User logged in!'), `ID: ${user.id}`);

    return { user: sanitizedUser, accessToken, refreshToken };
  };

  refresh = async (
    oldAccessToken: string,
    oldRefreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> => {
    try {
      console.log(getEmojiLog('👤', 'Refreshing user tokens...'));
      const user = this.parseAccessToken(oldAccessToken);
      const refreshPayload = this.parseRefreshToken(oldRefreshToken);

      const accessToken = this.getAccessToken(user);
      const refreshToken = this.getRefreshToken(refreshPayload);

      console.log(getEmojiLog('🙌', 'Tokens refreshed!'), `ID: ${user.id}`);
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch {
      console.log(
        getEmojiLog(
          '👎',
          'Access token failed to refresh. Checking refresh token...',
        ),
      );
      const token = this.parseRefreshToken(oldRefreshToken);
      const user = await this.repository.findUser(token.id);

      if (!user || !user.sessionId || token.sessionId !== user.sessionId) {
        console.log(
          getEmojiLog('🚫', 'Refreshing token failed!'),
          `User doesn't exist, or has no sessionId, or sessionIds did not match. ID: ${user?.id}`,
        );
        throw new NotAuthorized();
      }

      const sanitizedUser = classToPlain(user) as User;

      const accessToken = this.getAccessToken(sanitizedUser);
      const refreshToken = this.getRefreshToken({
        id: user.id,
        sessionId: user.sessionId,
      });

      console.log(getEmojiLog('🙌', 'Tokens refreshed!'), `ID: ${user.id}`);
      return { accessToken, refreshToken, user: sanitizedUser };
    }
  };

  requestResetPassword = async (email: string): Promise<void> => {
    console.log(getEmojiLog('👤', 'User requesting password reset...'));
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
      console.log(getEmojiLog('🚫', 'Request failed!'), 'User does not exist!');
      return;
    }

    user.passwordExpiration = new Date(Date.now() + 3600000);
    user.passwordResetId = shortid();

    this.emailService.sendResetPasswordEmail(user);

    this.repository.saveUser(user);
  };

  getAccessToken = (user: User): string =>
    jwt.sign(user, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '10m',
    });

  getRefreshToken = ({ id, sessionId }: RefreshTokenPayload): string =>
    jwt.sign({ id, sessionId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '24h',
    });

  parseAccessToken = (accessToken: string): User => {
    try {
      const payload = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

      return payload as User;
    } catch {
      throw new NotAuthorized();
    }
  };

  parseRefreshToken = (refreshToken: string): RefreshTokenPayload => {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      );

      return payload as RefreshTokenPayload;
    } catch {
      throw new NotAuthorized();
    }
  };
}

export default AuthService;

interface RefreshTokenPayload {
  id: string;
  sessionId?: string;
}
