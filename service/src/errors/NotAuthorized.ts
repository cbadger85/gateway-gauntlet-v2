import HttpError from './HttpError';

class NotAuthorized extends HttpError {
  constructor(message = 'not authorized to access this resource') {
    super(message, 401);
  }
}

export default NotAuthorized;
