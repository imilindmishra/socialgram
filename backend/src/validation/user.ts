import { z } from 'zod';


const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9._]{1,18}[a-z0-9])?$/;

export const UsernameParamSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(USERNAME_REGEX, 'Invalid username'),
});

export const FollowParamsSchema = UsernameParamSchema;

