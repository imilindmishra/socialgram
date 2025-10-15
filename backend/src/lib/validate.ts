import type { RequestHandler } from 'express';
import { badRequest } from './errors';

type SchemaLike<T = any> = { parseAsync(input: unknown): Promise<T> };

function formatValidationError(err: any): string {
  const issues = (err?.issues as Array<{ path?: (string | number)[]; message?: string }>) || [];
  if (Array.isArray(issues) && issues.length) {
    return issues.map((i) => `${(i.path || []).join('.') || 'value'}: ${i.message || 'invalid'}`).join('; ');
  }
  return err?.message || 'Invalid request';
}

export function validate<T>(schema: SchemaLike<T>, source: 'body' | 'params' | 'query'): RequestHandler {
  return async (req, _res, next) => {
    try {
      const input = (req as any)[source];
      (req as any)[source] = await schema.parseAsync(input);
      next();
    } catch (err: any) {
      next(badRequest(formatValidationError(err)));
    }
  };
}

export { formatValidationError };
