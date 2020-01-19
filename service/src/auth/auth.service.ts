import bcrypt from 'bcryptjs';
import { classToPlain } from 'class-transformer';
import { Service } from 'typedi';
import NotAuthorized from '../errors/NotAuthorized';
import User from '../users/entities/users.entity';
import UserRepository from '../users/users.repository';
import LoginRequest from './models/LoginRequest.dto';
import jwt from 'jsonwebtoken';
import { Role } from './models/Role';

@Service()
class AuthService {
  constructor(private repository: UserRepository) {}

  login = async (loginRequest: LoginRequest): Promise<User> => {
    const user = await this.repository.findUserByUsername(
      loginRequest.username,
    );

    // TODO add test for sessionId
    if (!user || !user.sessionId) {
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

  refresh = async (id: string, sessionId: string): Promise<User> => {
    const user = await this.repository.findUser(id);

    if (!user || !user.sessionId || sessionId !== user.sessionId) {
      throw new NotAuthorized();
    }

    return user;
  };

  getAccessToken = ({ id, roles }: User): string =>
    jwt.sign({ id, roles }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '10m',
    });

  getRefreshToken = ({ id, sessionId }: User): string =>
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
    } catch (e) {
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
    } catch (e) {
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
  sessionId: string;
}
