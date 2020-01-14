import dbSetup from '../dbSetup';
import index from '../index';
import server from '../server';
import dotenv from 'dotenv';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('../dbSetup', () => jest.fn());

jest.mock('../server', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({ listen: jest.fn() }),
}));

describe('index', () => {
  it('should configure dotenv', async () => {
    expect.assertions(1);
    await index;
    expect(dotenv.config).toBeCalled();
  });

  it('should call dbSetup', async () => {
    expect.assertions(1);
    await index;
    expect(dbSetup).toBeCalled();
  });

  it('should call server', async () => {
    expect.assertions(1);
    await index;
    expect(server).toBeCalled();
  });

  it('listen to a port', async () => {
    expect.assertions(1);
    await index;
    expect((await server()).listen).toBeCalledWith(4444, expect.any(Function));
  });
});
