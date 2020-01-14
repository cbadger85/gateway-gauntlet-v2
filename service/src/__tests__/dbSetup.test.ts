import { Container } from 'typedi';
import { createConnection, useContainer, getConnectionOptions } from 'typeorm';
import dbSetup from '../dbSetup';

jest.mock('typedi', () => ({
  Container: jest.fn(),
}));

jest.mock('typeorm', () => ({
  createConnection: jest.fn().mockResolvedValue('connection'),
  useContainer: jest.fn(),
  getConnectionOptions: jest.fn().mockResolvedValue({ option: true }),
}));

describe('dbSetup', () => {
  it('should call useContainer with Container', async () => {
    await dbSetup();

    expect(useContainer).toBeCalledWith(Container);
  });

  it('should get the connection options', async () => {
    await dbSetup();

    expect(getConnectionOptions).toBeCalled();
  });

  it('should get the connection options', async () => {
    await dbSetup();

    expect(createConnection).toBeCalledWith({ option: true });
  });
});
