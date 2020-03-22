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
  })),
}));

describe('dbSetup', () => {
  it('should call useContainer with Container', async () => {
    (createConnection as jest.Mock).mockResolvedValue('connection');
    await dbSetup();

    expect(useContainer).toBeCalledWith(Container);
  });

  it('should return a connection', async () => {
    (createConnection as jest.Mock).mockResolvedValue('connection');
    const connection = await dbSetup();

    expect(connection).toBe('connection');
  });

  it('should return an error if createConnection fails', async () => {
    (createConnection as jest.Mock).mockRejectedValue(new Error());
    const error = await dbSetup().catch(e => e);

    expect(error).toBeInstanceOf(Error);
  });
});
