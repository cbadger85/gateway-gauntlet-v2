import { Role } from '../auth/models/Role';
import { bootstrap } from '../bootstrap';
import dbSetup from '../dbSetup';
import User from '../users/entities/users.entity';
import bcrypt from 'bcryptjs';

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

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

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

  it('should call bcrypt.hash with the password', async () => {
    await bootstrap();

    expect(bcrypt.hash).toBeCalledWith('foobarbaz', 10);
  });

  it('should save the user', async () => {
    const user = new User();
    user.email = 'foo@example.com';
    user.username = 'foo';
    user.password = 'hashedPassword';
    user.roles = [Role.SUPER_ADMIN];
    user.sessionId = expect.any(String);
    user.firstName = 'foo';
    user.lastName = 'bar';

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
