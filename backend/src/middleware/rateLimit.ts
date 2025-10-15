import type { Request, Response, NextFunction, RequestHandler } from 'express';

type KeyFn = (req: Request) => string;

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

function rateLimit({ windowMs, max, keyFn }: { windowMs: number; max: number; keyFn: KeyFn }): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);
    const now = Date.now();
    const bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count < max) {
      bucket.count += 1;
      return next();
    }
    const retry = Math.max(0, bucket.resetAt - now);
    res.setHeader('Retry-After', Math.ceil(retry / 1000));
    return res.status(429).json({ error: 'Too many requests' });
  };
}

export const rateLimitWrite = rateLimit({
  windowMs: 60_000,
  max: 60,
  keyFn: (req) => String((req as any).user?.id || req.ip),
});

