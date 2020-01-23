import HttpError from './HttpError';

class Forbidden extends HttpError {
  name = '403 - Not Authorized';
  constructor(message = 'forbidden from this resource') {
    super(message, 403);
  }
}

export default Forbidden;
