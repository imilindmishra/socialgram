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

export function validateBody<T>(schema: SchemaLike<T>): RequestHandler {
  return async (req, _res, next) => {
    try {
      (req as any).body = await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      next(badRequest(formatValidationError(err)));
    }
  };
}

export function validateParams<T>(schema: SchemaLike<T>): RequestHandler {
  return async (req, _res, next) => {
    try {
      (req as any).params = await schema.parseAsync(req.params);
      next();
    } catch (err: any) {
      next(badRequest(formatValidationError(err)));
    }
  };
}

export function validateQuery<T>(schema: SchemaLike<T>): RequestHandler {
  return async (req, _res, next) => {
    try {
      (req as any).query = await schema.parseAsync(req.query);
      next();
    } catch (err: any) {
      next(badRequest(formatValidationError(err)));
    }
  };
}

