import HttpError from '../../errors/HttpError';

describe('HttpError', () => {
  it('should have a default status code of 500', () => {
    const error1 = new HttpError('message');
    const error2 = new HttpError('messsage', 404);

    expect(error1.statusCode).toBe(500);
    expect(error2.statusCode).not.toBe(500);
  });
});
