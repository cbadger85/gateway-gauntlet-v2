import HttpError from './HttpError';

class NotFound extends HttpError {
  constructor(
    public message: string,
    public statusCode = 404,
    public name = '404 - Not Found',
  ) {
    super(message, statusCode);
  }
}

export default NotFound;
