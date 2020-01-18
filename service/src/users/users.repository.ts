import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from './entities/users.entity';

@Service()
class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  saveUser = (user: User): Promise<User> => this.repository.save(user);

  findUser = (id: number): Promise<User | undefined> =>
    this.repository.findOne(id);
}

export default UserRepository;
