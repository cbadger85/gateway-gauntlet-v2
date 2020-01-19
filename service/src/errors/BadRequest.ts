import HttpError from './HttpError';

class BadRequest extends HttpError {
  constructor(public message: string, public name = '400 - Bad Request') {
    super(message, 400);
  }
}

export default BadRequest;
