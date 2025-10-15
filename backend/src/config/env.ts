import { parseEnv } from '../validation/env';

export function assertEnv() {
  parseEnv(process.env); // throws with a helpful message if invalid
}
