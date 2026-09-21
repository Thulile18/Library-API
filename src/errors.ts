// An error that carries an HTTP status code.
// Example: throw new HttpError(404, "Book not found");

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export = HttpError;
