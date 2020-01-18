import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import AddUserRequest from './models/AddUserRequest.dto';
import UserRepository from './users.repository';
import { classToPlain, plainToClass } from 'class-transformer';
import User from './entities/users.entity';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = async (user: AddUserRequest): Promise<User> => {
    const password = await bcrypt.hash(user.password, 10);

    const savedUser = await this.repository.saveUser(
      plainToClass(User, { ...user, password }),
    );

    return classToPlain(savedUser) as User;
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
