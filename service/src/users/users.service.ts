import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import NotFound from '../errors/NotFound';
import AddUserRequest from './models/AddUserRequest.dto';
import UserRepository from './users.repository';
import { classToPlain } from 'class-transformer';
import User from './entities/users.entity';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = async (user: AddUserRequest): Promise<User> => {
    const password = await bcrypt.hash(user.password, 10);

    const newUser = { ...user, password };

    const savedUser = await this.repository.saveUser(newUser);

    return classToPlain(savedUser) as User;
  };

  getUser = async (id: number): Promise<User> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new NotFound('user not found');
    }

    return classToPlain(user) as User;
  };
}

export default UserService;
