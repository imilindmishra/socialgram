import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyJwt } from '../utils/jwt';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.substring('Bearer '.length);
  try {
    const payload = verifyJwt(token);
    (req as any).user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
