import { Container } from 'typedi';
import { createConnection, useContainer, getConnectionOptions } from 'typeorm';
import dbSetup from '../dbSetup';

jest.mock('typedi', () => ({
  Container: jest.fn(),
}));

jest.mock('typeorm', () => ({
  createConnection: jest.fn(),
  useContainer: jest.fn(),
  getConnectionOptions: jest.fn().mockResolvedValue({ option: true }),
}));

describe('dbSetup', () => {
  it('should call useContainer with Container', async () => {
    (createConnection as jest.Mock).mockResolvedValue('connection');
    await dbSetup();

    expect(useContainer).toBeCalledWith(Container);
  });

  it('should get the connection options', async () => {
    (createConnection as jest.Mock).mockResolvedValue('connection');
    await dbSetup();

    expect(getConnectionOptions).toBeCalled();
  });

  it('should return the connection', async () => {
    (createConnection as jest.Mock).mockResolvedValue('connection');
    await dbSetup();

    expect(createConnection).toBeCalledWith({ option: true });
  });

  it('should return a connection', async () => {
    (createConnection as jest.Mock).mockRejectedValue(new Error());
    const error = await dbSetup().catch(e => e);

    expect(error).toBeInstanceOf(Error);
  });
});
