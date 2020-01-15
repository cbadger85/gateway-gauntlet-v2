import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import { AddUserDto } from './models/AddUser.dto';
import { SantizedUserDto } from './models/SanitizedUser.dto';
import UserRepository from './users.repository';
import { Role } from '../auth/models/Role';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  private transformRolesToString = (roles: Role[]): string => roles.join(',');

  private transformStringToRoles = (roles: string): Role[] =>
    roles.split(',') as Role[];

  addUser = async (user: AddUserDto): Promise<SantizedUserDto> => {
    const password = await bcrypt.hash(user.password, 10);

    const { id, username, roles } = await this.repository.saveUser({
      username: user.username,
      roles: this.transformRolesToString(user.roles),
      password,
    });

    return {
      username,
      id,
      roles: this.transformStringToRoles(roles),
    };
  };

  getUser = async (id: number): Promise<SantizedUserDto | undefined> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    return {
      username: user.username,
      id: user.id,
      roles: this.transformStringToRoles(user.roles),
    };
  };
}

export default UserService;
