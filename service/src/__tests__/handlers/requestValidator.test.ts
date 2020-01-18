import { IsNotEmpty, ValidationError } from 'class-validator';
import 'reflect-metadata';
import { requestValidator } from '../../handlers/requestValidator';

describe('requestValidator', () => {
  it('should call next with nothing if the validator passes', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
    };

    class ValidatorClass {
      @IsNotEmpty()
      foo: string;

      @IsNotEmpty()
      bar: string;
    }

    await requestValidator(ValidatorClass)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(undefined);
  });

  it('should call next with ValidationError[] if the validator fails', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo' },
    };

    class ValidatorClass {
      @IsNotEmpty()
      foo: string;

      @IsNotEmpty()
      bar: string;
    }

    await requestValidator(ValidatorClass)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(
      expect.arrayContaining([expect.any(ValidationError)]),
    );
  });
});
