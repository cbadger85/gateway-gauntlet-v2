import HttpError from './HttpError';

class NotAuthorized extends HttpError {
  name = '401 - Not Authorized';
  constructor(message = 'not authorized to access this resource') {
    super(message, 401);
  }
}

export default NotAuthorized;
