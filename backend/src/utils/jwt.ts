import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/env';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  name: string;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
}
