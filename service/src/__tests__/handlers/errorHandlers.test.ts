import {
  asyncHandler,
  errorHandler,
  validationErrorHandler,
} from '../../handlers/errorHandlers';
import NotFound from '../../errors/NotFound';
import { ValidationError } from 'class-validator';

class MockRes {
  status = jest.fn().mockReturnThis();
  json = jest.fn().mockReturnThis();
}

describe('errorHandlers', () => {
  describe('asyncHandler', () => {
    it('should call next with Error', async () => {
      const error = new Error();
      const next = jest.fn();
      const handler = jest.fn().mockRejectedValue(error);

      await asyncHandler(handler)(null as any, null as any, next);

      expect(next).toBeCalledWith(error);
    });
  });

  describe('validationErrorHandler', () => {
    it('should call res.status with 400 if the error is a validation error', () => {
      const error = new ValidationError();
      error.constraints = { error: 'this is an error' };
      const mockRes = new MockRes();
      validationErrorHandler(
        [error],
        null as any,
        mockRes as any,
        jest.fn() as any,
      );

      expect(mockRes.status).toBeCalledWith(400);
    });

    it('should call res.json with an error message', () => {
      const error = new ValidationError();
      error.constraints = { error: 'this is an error' };
      const mockRes = new MockRes();
      validationErrorHandler(
        [error],
        null as any,
        mockRes as any,
        jest.fn() as any,
      );

      expect(mockRes.json).toBeCalledWith({
        errors: expect.arrayContaining([expect.any(ValidationError)]),
      });
    });
  });

  describe('errorHandler', () => {
    it('should call res.status with the status code of the error', () => {
      const error = new NotFound('not found');
      const mockRes = new MockRes();
      errorHandler(error, null as any, mockRes as any, jest.fn() as any);
      expect(mockRes.status).toBeCalledWith(error.statusCode);
    });

    it('should call res.status with 500 if no code exists', () => {
      const error = new Error();
      const mockRes = new MockRes();
      errorHandler(error, null as any, mockRes as any, jest.fn() as any);
      expect(mockRes.status).toBeCalledWith(500);
    });

    it('should call res.json with the name, message and statusCode', () => {
      const error = new NotFound('not found');
      const mockRes = new MockRes();
      const responseBody = {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      };
      errorHandler(error, null as any, mockRes as any, jest.fn() as any);
      expect(mockRes.json).toBeCalledWith(responseBody);
    });
  });
});
