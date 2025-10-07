import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  // eslint-disable-next-line no-console
  console.error('[ErrorHandler]', status, message, err?.stack ?? '');
  res.status(status).json({ error: message });
}

