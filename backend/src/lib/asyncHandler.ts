import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler<F extends (...args: any[]) => any>(fn: F): RequestHandler {
  return function wrapped(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

