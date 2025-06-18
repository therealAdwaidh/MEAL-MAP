//src/lib/rateLimiter.ts

import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
points: 5, // 5 requests
duration: 60, // per 60 seconds per IP
});