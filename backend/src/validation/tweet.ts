import { z } from 'zod';
import { ObjectId, Caption280, Text500, Url } from './primitives';


export const TweetCreateLegacySchema = z.object({
  caption: Caption280,
  imageUrl: Url,
});


export const TweetCreateSchema = z.object({
  text: Caption280,
  media: z.array(Url).max(4).optional().default([]),
});

export const TweetIdParamsSchema = z.object({ id: ObjectId });

export const TweetReplyParamsSchema = z.object({
  id: ObjectId,
  commentId: ObjectId,
});

export const TweetCommentBodySchema = z.object({ text: Text500 });

export type TweetCreateLegacy = z.infer<typeof TweetCreateLegacySchema>;
export type TweetCreate = z.infer<typeof TweetCreateSchema>;

// Replies listing (Phase 4)
export const TweetRepliesQuerySchema = z.object({
  cursor: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const TweetListQuerySchema = TweetRepliesQuerySchema;


export const QuoteCreateSchema = z.object({
  text: Caption280,
  media: z.array(Url).max(4).optional().default([]),
});
