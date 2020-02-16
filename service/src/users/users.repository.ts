import { Service } from 'typedi';
import { Repository, Like, Not, IsNull } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from './users.entity';

@Service()
class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  saveUser = (user: User): Promise<User> => this.repository.save(user);

  findUser = (id: string): Promise<User | undefined> =>
    this.repository.findOne(id);

  findAllUsers = (): Promise<User[]> => this.repository.find();

  findUserByUsername = (username: string): Promise<User | undefined> =>
    this.repository.findOne({ username });

  findUserByEmail = (email: string): Promise<User | undefined> =>
    this.repository.findOne({ email });

  countUsersByUsernameOrEmail = async (
    username: string,
    email: string,
  ): Promise<[User[], number]> => {
    const usersAndCount = await this.repository.findAndCount({
      where: [{ username }, { email }],
    });

    return usersAndCount;
  };

  findUsersByIds = (Ids: string[]): Promise<User[]> =>
    this.repository.findByIds(Ids);

  findOrganizers = (): Promise<User[]> =>
    this.repository.find({
      where: [
        {
          roles: Like('%ORGANIZER%'),
          sessionId: Not(IsNull()),
        },
        {
          roles: Like('%ADMIN%'),
          sessionId: Not(IsNull()),
        },
        {
          roles: Like('%SUPER_ADMIN%'),
          sessionId: Not(IsNull()),
        },
      ],
      select: ['id', 'firstName', 'lastName'],
    });
}

export default UserRepository;
