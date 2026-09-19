class HttpError extends Error {
  status: number;
  details: string[] | undefined;

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(message: string, details?: string[]) {
    return new HttpError(400, message, details);
  }
  static notFound(message: string) {
    return new HttpError(404, message);
  }
  static conflict(message: string) {
    return new HttpError(409, message);
  }
}

export = HttpError;
