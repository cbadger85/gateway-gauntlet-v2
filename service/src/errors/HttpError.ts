class HttpError extends Error {
  constructor(public message: string, public statusCode = 500) {
    super(message);
  }
}

export default HttpError;
