import { Container } from 'typedi';
import { createConnection, useContainer, MigrationExecutor } from 'typeorm';
import * as typeorm from 'typeorm';
import dbSetup from '../dbSetup';

jest.mock('typedi', () => ({
  Container: jest.fn(),
}));

jest.mock('typeorm', () => ({
  createConnection: jest.fn(),
  useContainer: jest.fn(),
  getConnectionOptions: jest.fn().mockResolvedValue({ option: true }),
  MigrationExecutor: jest.fn().mockImplementation(() => ({
    executePendingMigrations: jest.fn().mockResolvedValue(null),
    getAllMigrations: jest.fn().mockResolvedValue([{ name: 'migration 1' }]),
    executeMigration: jest.fn().mockResolvedValue(null),
  })),
}));

describe('dbSetup', () => {
  it('should call useContainer with Container', async () => {
    (createConnection as jest.Mock).mockResolvedValue({
      runMigrations: jest.fn(),
      migrations: [],
    });
    await dbSetup();

    expect(useContainer).toBeCalledWith(Container);
  });

  it('should return a connection', async () => {
    (createConnection as jest.Mock).mockResolvedValue({
      runMigrations: jest.fn(),
      migrations: [],
    });
    const connection = await dbSetup();

    expect(connection).toEqual({
      runMigrations: expect.any(Function),
      migrations: expect.any(Array),
    });
  });

  it('should call runMigrations', async () => {
    const runMigrations = jest.fn();
    (createConnection as jest.Mock).mockResolvedValue({
      runMigrations,
      migrations: [],
    });

    await dbSetup();

    expect(runMigrations).toBeCalled();
  });

  it('should return an error if createConnection fails', async () => {
    (createConnection as jest.Mock).mockRejectedValue(new Error());
    const error = await dbSetup().catch(e => e);

    expect(error).toBeInstanceOf(Error);
  });
});
