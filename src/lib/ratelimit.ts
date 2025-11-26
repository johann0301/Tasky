import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "server-only";

// Lazy initialization to avoid errors during build time
let redisInstance: Redis | null = null;
let ratelimitInstance: Ratelimit | null = null;

// Detect if we're in build time
// Next.js sets NEXT_PHASE during build, or we can check if env vars are missing
const isBuildTime = 
  (typeof process.env.NEXT_PHASE !== "undefined" && 
   process.env.NEXT_PHASE === "phase-production-build") ||
  (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN);

function getRedis(): Redis {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    // During build time or if env vars are missing, create a dummy instance
    // This allows the build to succeed, but will fail at runtime if not configured
    // Always create a dummy if vars are missing (build time scenario)
    if (!url || !token) {
      // Create a dummy instance - allows build to proceed
      // Will be replaced at runtime if vars are provided
      redisInstance = new Redis({
        url: "https://dummy-build-time.upstash.io",
        token: "dummy-build-token",
      });
    } else {
      // Runtime: use real credentials
      redisInstance = new Redis({
        url,
        token,
      });
    }
  }
  return redisInstance;
}

function getRatelimit(): Ratelimit {
  if (!ratelimitInstance) {
    // At runtime (not build time), verify env vars are set when actually used
    if (!isBuildTime && (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)) {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
    }
    
    const redis = getRedis();
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "@ratelimit/tasks",
    });
  }
  return ratelimitInstance;
}

// Export a proxy that lazy-loads the ratelimit only when actually accessed
// This prevents initialization during build time
export const taskCreationRatelimit = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    const ratelimit = getRatelimit();
    const value = ratelimit[prop as keyof Ratelimit];
    // Bind functions to maintain correct 'this' context
    return typeof value === "function" ? value.bind(ratelimit) : value;
  },
});
