export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const createError = (status: number, message: string) => new HttpError(status, message);
export const badRequest = (m: string) => createError(400, m);
export const unauthorized = (m: string) => createError(401, m);
export const notFound = (m: string) => createError(404, m);

