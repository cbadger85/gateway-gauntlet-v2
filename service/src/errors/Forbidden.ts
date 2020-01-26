import HttpError from './HttpError';

class Forbidden extends HttpError {
  name = '403 - Forbidden';
  constructor(message = 'forbidden from this resource') {
    super(message, 403);
  }
}

export default Forbidden;
