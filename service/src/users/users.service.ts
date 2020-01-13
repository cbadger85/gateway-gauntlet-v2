import { Service } from 'typedi';
import User from './users.entity';
import UserRepository from './users.repository';

@Service()
class UserService {
  constructor(private repository: UserRepository) {}

  addUser = (user: User): Promise<User> => this.repository.saveUser(user);

  getUser = async (id: number): Promise<User | undefined> => {
    const user = await this.repository.findUser(id);

    if (!user) {
      throw new Error('no user found');
    }

    return user;
  };
}

export default UserService;
