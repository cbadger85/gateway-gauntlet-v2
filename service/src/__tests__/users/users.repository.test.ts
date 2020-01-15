import { Container } from 'typedi';
import { createConnection, getConnection, getRepository } from 'typeorm';
import User from '../../users/entities/users.entity';
import UserRepository from '../../users/users.repository';

beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
    name: 'user-repository-test',
  });
});

afterEach(() => {
  const conn = getConnection('user-repository-test');
  return conn.close();
});

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    Container.set(
      UserRepository,
      new UserRepository(getRepository(User, 'user-repository-test')),
    );
    userRepository = Container.get(UserRepository);
  });

  it('should save a user', async () => {
    const user = { username: 'foo', password: 'bar', roles: 'USER' };

    const savedUser = await userRepository.saveUser(user as User);

    expect(user).toEqual(savedUser);
  });

  it('should retreive a user', async () => {
    const user = { username: 'foo', password: 'bar', roles: 'USER' };

    const repo = getRepository(User, 'user-repository-test');

    const savedUser = await repo.save(user);

    const retrievedUser = await userRepository.findUser(savedUser.id);

    expect(user).toEqual(retrievedUser);
  });
});
