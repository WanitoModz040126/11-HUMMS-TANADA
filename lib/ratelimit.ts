import { Ratelimit } from "@upstash/ratelimit";
import { redis, redisConfigured } from "./redis";

/**
 * Sliding-window limiter: 8 requests per 10 seconds per IP, per route.
 * This protects the API routes from being hammered by a script or a
 * refresh-spam loop. It is application-level throttling, not a substitute
 * for network-level DDoS protection (Vercel's edge network already
 * absorbs most volumetric traffic before it reaches this function).
 */
export const limiter = redisConfigured
  ? new Ratelimit({
      redis: redis as NonNullable<typeof redis>,
      limiter: Ratelimit.slidingWindow(8, "10 s"),
      prefix: "ratelimit:humss-tanada",
    })
  : null;

export async function checkRateLimit(identifier: string) {
  if (!limiter) {
    // No Redis configured (e.g. local dev without env vars yet): allow the
    // request through instead of breaking the site.
    return { success: true, remaining: 999 };
  }
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
