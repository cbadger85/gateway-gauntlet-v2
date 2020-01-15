import { InjectRepository } from 'typeorm-typedi-extensions';
import User from './users.entity';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { AddUserDto } from './models/AddUser.dto';

@Service()
class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  saveUser = (user: AddUserDto): Promise<User> => this.repository.save(user);

  findUser = (id: number): Promise<User | undefined> =>
    this.repository.findOne(id);
}

export default UserRepository;
