import { Container } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { Role } from '../../auth/Role.model';
import User from '../../users/users.entity';
import UserRepository from '../../users/users.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    Container.set(UserRepository, new UserRepository(getRepository(User)));
    userRepository = Container.get(UserRepository);
  });

  it('should save a user', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const savedUser = await userRepository.saveUser(user as any);

    expect(user).toEqual(savedUser);
  });

  it('should retreive a user', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    const savedUser = await repo.save(user);

    const retrievedUser = await userRepository.findUser(savedUser.id as string);

    expect(user).toEqual(retrievedUser);
  });

  it('should retreive a user by username', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    await repo.save(user);

    const retrievedUser = await userRepository.findUserByUsername(
      user.username,
    );

    expect(user).toEqual(retrievedUser);
  });

  it('should retreive a user by username', async () => {
    const user = {
      username: 'foo',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    await repo.save(user);

    const retrievedUser = await userRepository.findUserByEmail(user.email);

    expect(user).toEqual(retrievedUser);
  });

  it('should find a list of users that match both email and username', async () => {
    const user1 = {
      username: 'foo1',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo1@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user2 = {
      username: 'foo2',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '5678',
      email: 'foo2@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user3 = {
      username: 'foo3',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '9012',
      email: 'foo3@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    const savedUser1 = await repo.save(user1);
    const savedUser2 = await repo.save(user2);
    const savedUser3 = await repo.save(user3);

    const [users, number] = await userRepository.countUsersByUsernameOrEmail(
      'foo1',
      'foo2@example.com',
    );

    expect(number).toEqual(2);
    expect(users).toEqual([savedUser1, savedUser2]);
  });

  it('should find a list of all users', async () => {
    const user1 = {
      username: 'foo1',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo1@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user2 = {
      username: 'foo2',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '5678',
      email: 'foo2@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user3 = {
      username: 'foo3',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '9012',
      email: 'foo3@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    await repo.save(user1);
    await repo.save(user2);
    await repo.save(user3);

    const users = await userRepository.findAllUsers();

    expect(users).toHaveLength(3);
  });

  it('should find a list of users by ids', async () => {
    const user1 = {
      username: 'foo1',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo1@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user2 = {
      username: 'foo2',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '5678',
      email: 'foo2@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const user3 = {
      username: 'foo3',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '9012',
      email: 'foo3@example.com',
      firstName: 'foo',
      lastName: 'bar',
    };

    const repo = getRepository(User);

    const users = await repo.save([user1, user2, user3]);

    const foundUsers = await userRepository.findUsersByIds([
      users[0].id,
      users[1].id,
    ]);

    expect(foundUsers).toEqual(expect.arrayContaining([users[0], users[1]]));
  });

  it('should find all organizers', async () => {
    const user1 = {
      username: 'foo1',
      password: 'bar',
      roles: [Role.USER],
      sessionId: '1234',
      email: 'foo1@example.com',
      firstName: 'foo1',
      lastName: 'bar',
    };

    const user2 = {
      username: 'foo2',
      password: 'bar',
      roles: [Role.ORGANIZER],
      sessionId: '5678',
      email: 'foo2@example.com',
      firstName: 'foo2',
      lastName: 'bar',
    };

    const user3 = {
      username: 'foo3',
      password: 'bar',
      roles: [Role.ORGANIZER],
      sessionId: null,
      email: 'foo3@example.com',
      firstName: 'foo3',
      lastName: 'bar',
    };

    const user4 = {
      username: 'foo4',
      password: 'bar',
      roles: [Role.ADMIN],
      sessionId: '9999',
      email: 'foo4@example.com',
      firstName: 'foo4',
      lastName: 'bar',
    };

    const repo = getRepository(User);
    const users = await repo.save([user1, user2, user3, user4]);

    const foundUsers = await userRepository.findOrganizers();

    const expectedUsers = [
      {
        id: expect.any(String),
        firstName: user2.firstName,
        lastName: user2.lastName,
      },
      {
        id: expect.any(String),
        firstName: user4.firstName,
        lastName: user4.lastName,
      },
    ];

    expect(foundUsers).toEqual(expectedUsers);
  });
});
