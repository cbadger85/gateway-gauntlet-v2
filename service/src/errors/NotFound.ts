import HttpError from './HttpError';

class NotFound extends HttpError {
  constructor(public message: string, public name = '404 - Not Found') {
    super(message, 404);
  }
}

export default NotFound;
