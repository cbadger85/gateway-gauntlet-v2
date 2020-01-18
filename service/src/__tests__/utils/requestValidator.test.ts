import { requestValidator } from '../../utils/requestValidator';
import HttpError from '../../errors/HttpError';
import { IsNotEmpty, ValidationError } from 'class-validator';
import User from '../../users/entities/users.entity';
import 'reflect-metadata';

describe('requestValidator', () => {
  it('should call next with nothing if the validator passes', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
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

    await requestValidator(ValidatorClass)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(undefined);
  });

  it('should call next with ValidationError[] if the validator failes', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo' },
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

    await requestValidator(ValidatorClass)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(
      expect.arrayContaining([expect.any(ValidationError)]),
    );
  });

  it('should call next with an HttpError if the validator is not a class', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
    };

    const badValue = 'bad value';

    await requestValidator(badValue)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(new HttpError('Invalid validator'));
  });

  it('should call next with an HttpError if the validator is a class but does not have an of static method', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
    };

    class BadClass {}

    const badValue = new BadClass();

    await requestValidator(badValue)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(new HttpError('Invalid validator'));
  });

  it('should call next with an HttpError if the validator is a class but does not have an of static method', async () => {
    const next = jest.fn();

    const mockReq = {
      body: { foo: 'foo', bar: 'bar' },
    };

    class BadClass {
      static of() {
        return 'baaaad';
      }
    }

    const badValue = new BadClass();

    await requestValidator(badValue)(mockReq as any, null as any, next);

    expect(next).toBeCalledWith(new HttpError('Invalid validator'));
  });
});
