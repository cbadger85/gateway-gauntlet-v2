import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';
import shortid from 'shortid';
import { Service } from 'typedi';
import EmailService from '../email/email.service';
import NotAuthorized from '../errors/NotAuthorized';
import User from '../users/entities/users.entity';
import UserRepository from '../users/users.repository';
import LoginRequest from './models/LoginRequest.dto';
import { Role } from './models/Role';

@Service()
class AuthService {
  constructor(
    private repository: UserRepository,
    private emailService: EmailService,
  ) {}

  login = async (
    loginRequest: LoginRequest,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const user = await this.repository.findUserByUsername(
      loginRequest.username,
    );

    if (!user || !user.sessionId || !user.password) {
      throw new NotAuthorized();
    }

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new NotAuthorized();
    }

    const sanitizedUser = classToPlain(user) as User;
    const { id, sessionId } = user;
    const accessToken = this.getAccessToken(sanitizedUser);
    const refreshToken = this.getRefreshToken({ id, sessionId });

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
      const user = this.parseAccessToken(oldAccessToken);
      const refreshPayload = this.parseRefreshToken(oldRefreshToken);

      const accessToken = this.getAccessToken(user);
      const refreshToken = this.getRefreshToken(refreshPayload);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch {
      const token = this.parseRefreshToken(oldRefreshToken);
      const user = await this.repository.findUser(token.id);

      if (!user || !user.sessionId || token.sessionId !== user.sessionId) {
        throw new NotAuthorized();
      }

      const sanitizedUser = classToPlain(user) as User;

      const accessToken = this.getAccessToken(sanitizedUser);
      const refreshToken = this.getRefreshToken({
        id: user.id,
        sessionId: user.sessionId,
      });

      return { accessToken, refreshToken, user: sanitizedUser };
    }
  };

  requestResetPassword = async (email: string): Promise<void> => {
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
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

interface AccessTokenPayload {
  id: string;
  roles: Role[];
}

interface RefreshTokenPayload {
  id: string;
  sessionId?: string;
}
