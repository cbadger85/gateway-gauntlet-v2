import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { Service } from 'typedi';
import NotAuthorized from '../errors/NotAuthorized';
import User from '../users/entities/users.entity';
import UserRepository from '../users/users.repository';
import LoginRequest from './models/LoginRequest.dto';
import jwt from 'jsonwebtoken';
import { Role } from './models/Role';
import { UserAuth } from './models/UserAuth';
import shortid from 'shortid';
import EmailService from '../email/email.service';

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
    const { id, sessionId, roles } = user;
    const accessToken = this.getAccessToken({ id, roles });
    const refreshToken = this.getRefreshToken({ id, sessionId });

    return { user: sanitizedUser, accessToken, refreshToken };
  };

  refresh = async (
    oldAccessToken: string,
    oldRefreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userAuth: UserAuth;
  }> => {
    try {
      const accessPayload = this.parseAccessToken(oldAccessToken);
      const refreshPayload = this.parseRefreshToken(oldRefreshToken);

      const accessToken = this.getAccessToken(accessPayload);
      const refreshToken = this.getRefreshToken(refreshPayload);

      const userAuth = { id: accessPayload.id, roles: accessPayload.roles };

      return {
        accessToken,
        refreshToken,
        userAuth,
      };
    } catch {
      const token = this.parseRefreshToken(oldRefreshToken);
      const user = await this.repository.findUser(token.id);

      if (!user || !user.sessionId || token.sessionId !== user.sessionId) {
        throw new NotAuthorized();
      }

      const { id, sessionId, roles } = user;

      const accessToken = this.getAccessToken({ id, roles });
      const refreshToken = this.getRefreshToken({ id, sessionId });

      const userAuth = { id: user.id, roles: user.roles };

      return { accessToken, refreshToken, userAuth };
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

  getAccessToken = ({ id, roles }: AccessTokenPayload): string =>
    jwt.sign({ id, roles }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '10m',
    });

  getRefreshToken = ({ id, sessionId }: RefreshTokenPayload): string =>
    jwt.sign({ id, sessionId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '24h',
    });

  parseAccessToken = (accessToken: string): AccessTokenPayload => {
    try {
      const payload = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      );

      return payload as AccessTokenPayload;
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
