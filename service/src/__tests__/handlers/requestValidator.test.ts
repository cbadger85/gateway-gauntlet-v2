import HttpError from '../../errors/HttpError';
import { IsNotEmpty, ValidationError } from 'class-validator';
import User from '../../users/entities/users.entity';
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

  it('should call next with an HttpError if the request body has fields not in the validator class', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar', baz: 'baz' },
    };

    class ValidatorClass {
      private constructor(foo: string, bar: string) {
        this.foo = foo;
        this.bar = bar;
      }

      @IsNotEmpty()
      foo: string;

      @IsNotEmpty()
      bar: string;

      static of({ foo, bar }: ValidatorClass) {
        return new ValidatorClass(foo, bar);
      }
    }

    await requestValidator(ValidatorClass as any)(
      mockReq as any,
      null as any,
      next,
    );

    expect(next).toBeCalledWith(
      expect.arrayContaining([expect.any(ValidationError)]),
    );
  });
});
