import { serverTimout } from '../../handlers/serverTimeout';
import HttpError from '../../errors/HttpError';

describe('serverTimout', () => {
  it('should call res.setTimout with a time and function', () => {
    const mockRes = {
      setTimeout: jest.fn(),
    };
    const next = jest.fn();

    serverTimout(500)({} as any, mockRes as any, next);

    expect(mockRes.setTimeout).toBeCalledWith(500, expect.any(Function));
  });

  it('should call next with nothing', () => {
    const mockRes = {
      setTimeout: jest.fn(),
    };
    const next = jest.fn();

    serverTimout()({} as any, mockRes as any, next);

    expect(next).toBeCalledWith();
  });

  it('should have a callback that calls next with an HttpError', () => {
    const setTimeoutMock = (mock: jest.Mock) => (
      time: number,
      callback: () => void,
    ): void => {
      mock.mockImplementation(callback)();
    };

    const callbackMock = jest.fn();

    const mockRes = {
      setTimeout: setTimeoutMock(callbackMock),
    };
    const next = jest.fn();

    serverTimout()({} as any, mockRes as any, next);

    expect(next).toHaveBeenNthCalledWith(1, expect.any(HttpError));
  });
});
