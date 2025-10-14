import { z } from 'zod';

// Mongo ObjectId 24-hex
export const ObjectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

// URL
export const Url = z.string().url('Invalid URL');

// Bounded trimmed strings
export const Trimmed = z.string().trim();
export const NonEmpty = Trimmed.min(1, 'Required');
export const Bounded = (min: number, max: number) => Trimmed.min(min).max(max);


export const Caption280 = Bounded(1, 280);
export const Text500 = Bounded(1, 500);

// Pagination (to be used later when endpoints support it)
export const Pagination = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

