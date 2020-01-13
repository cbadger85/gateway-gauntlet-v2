import { getConnection, createConnection, getRepository } from 'typeorm';
import User from '../../users/users.entity';
import UserRepository from '../../users/users.repository';
import { Container } from 'typedi';

beforeAll(() => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User],
    synchronize: true,
    logging: false,
  });
});

afterAll(() => {
  const conn = getConnection();
  return conn.close();
});

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeAll(() => {
    Container.set(UserRepository, new UserRepository(getRepository(User)));
    userRepository = Container.get(UserRepository);
  });

  it('should save and retreive a user', async () => {
    const user = { username: 'foo', password: 'bar' };

    const savedUser = await userRepository.saveUser(user as User);

    const retrievedUser = await userRepository.findUser(savedUser.id);

    expect(user).toEqual(retrievedUser);
  });
});
