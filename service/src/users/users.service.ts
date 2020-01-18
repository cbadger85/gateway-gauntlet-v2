import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import { AddUserDto } from './models/AddUser.dto';
import { SantizedUserDto } from './models/SanitizedUser.dto';
import UserRepository from './users.repository';
import { Role } from '../auth/models/Role';
<<<<<<< HEAD
// import { validate, validateOrReject } from 'class-validator';
import User from './entities/users.entity';
=======
>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  private transformRolesToString = (roles: Role[]): string => roles.join(',');

  private transformStringToRoles = (roles: string): Role[] =>
    roles.split(',') as Role[];

  addUser = async (user: AddUserDto): Promise<SantizedUserDto> => {
    const password = await bcrypt.hash(user.password, 10);

<<<<<<< HEAD
    const newUser = User.of({
      username: user.username,
      password,
      roles: this.transformRolesToString(user.roles),
    });

    const { id, username, roles } = await this.repository.saveUser(newUser);

=======
    const { id, username, roles } = await this.repository.saveUser({
      username: user.username,
      roles: this.transformRolesToString(user.roles),
      password,
    });

>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c
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
