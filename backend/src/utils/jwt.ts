import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  name: string;
}

export function signJwt(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
}

