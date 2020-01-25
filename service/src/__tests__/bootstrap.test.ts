import dotenv from 'dotenv';
import dbSetup from '../dbSetup';
import { bootstrap } from '../bootstrap';
import User from '../users/entities/users.entity';
import { Role } from '../auth/models/Role';

jest.mock('../dbSetup.ts', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    getRepository: jest.fn().mockReturnValue({
      findAndCount: jest.fn().mockResolvedValue([null, 0]),
      save: jest.fn(),
    }),
    close: jest.fn(),
  }),
}));

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.spyOn(console, 'log');

beforeEach(jest.clearAllMocks);

describe('bootstrap', () => {
  it('should call dbSetup', async () => {
    await bootstrap();
    expect(dbSetup).toBeCalled();
  });

  it('should get a repository', async () => {
    await bootstrap();
    expect((await dbSetup()).getRepository).toBeCalledWith(User);
  });

  it('should find if a user already exists', async () => {
    const query = {
      where: [{ username: 'foo' }, { email: 'foo@example.com' }],
    };
    await bootstrap();
    expect((await dbSetup()).getRepository(User).findAndCount).toBeCalledWith(
      query,
    );
  });

  it('should save the user', async () => {
    const user = new User();
    user.email = 'foo@example.com';
    user.username = 'foo';
    user.password = 'foobarbaz';
    user.roles = [Role.SUPER_ADMIN];
    user.sessionId = expect.any(String);

    await bootstrap();

    expect((await dbSetup()).getRepository(User).save).toBeCalledWith(user);
  });

  it('should find if a user already exists', async () => {
    const connection = await dbSetup();
    const repository = connection.getRepository(User);
    (repository.findAndCount as jest.Mock).mockResolvedValue([null, 1]);

    expect((await dbSetup()).getRepository(User).save).not.toBeCalled();
  });
});
