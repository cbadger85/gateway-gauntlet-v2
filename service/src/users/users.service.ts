import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import { AddUserDto } from './models/AddUser.dto';
import { SantizedUserDto } from './models/SanitizedUser.dto';
import UserRepository from './users.repository';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = async (user: AddUserDto): Promise<SantizedUserDto> => {
    const password = await bcrypt.hash(user.password, 10);

    const { id, username } = await this.repository.saveUser({
      username: user.username,
      password,
    });

    return {
      username,
      id,
    };
  };

  getUser = async (id: number): Promise<SantizedUserDto | undefined> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    return { username: user.username, id: user.id };
  };
}

export default UserService;
