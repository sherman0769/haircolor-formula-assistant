import { Redis } from "@upstash/redis";

const VISIT_COUNTER_KEY = "haircolor:homepage:unique-visits";

let redisClient: Redis | null = null;

export function hasVisitCounterConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getRedisClient() {
  if (!hasVisitCounterConfig()) {
    return null;
  }

  redisClient ??= Redis.fromEnv();

  return redisClient;
}

export async function getHomepageVisitCount() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  const count = await redis.get<number>(VISIT_COUNTER_KEY);

  return count ?? 0;
}

export async function incrementHomepageVisitCount() {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  return redis.incr(VISIT_COUNTER_KEY);
}
