import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from './entities/users.entity';

@Service()
class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  saveUser = (user: User): Promise<User> => this.repository.save(user);

  findUser = (id: string): Promise<User | undefined> =>
    this.repository.findOne(id);

  findUserByUsername = (username: string): Promise<User | undefined> =>
    this.repository.findOne({ username });
}

export default UserRepository;
