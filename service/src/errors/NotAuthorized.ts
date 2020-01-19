import HttpError from './HttpError';

class NotAuthorized extends HttpError {
  constructor(
    message = 'not authorized to access this resource',
    name = '401 - Not Authorized',
  ) {
    super(message, 401);
  }
}

export default NotAuthorized;
