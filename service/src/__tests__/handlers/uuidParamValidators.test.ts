import { uuidParamValidator } from '../../handlers/uuidParamValidator';
import uuid from 'uuid/v4';
import BadRequest from '../../errors/BadRequest';

describe('requestValidator', () => {
  it('should call next with nothing if the validator passes', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
      params: { id: uuid() },
    };

    uuidParamValidator()(mockReq as any, null as any, next);

    expect(next).toBeCalled();
  });

  it('should skip whitelisted params', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
      params: { id: uuid(), nonUuid: '1234' },
    };

    uuidParamValidator({ whitelist: ['nonUuid'] })(
      mockReq as any,
      null as any,
      next,
    );

    expect(next).toBeCalled();
  });

  it('should call next with a BadRequest if the validator fails', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo' },
      params: { id: '111' },
    };

    uuidParamValidator()(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(expect.any(BadRequest));
  });
});
