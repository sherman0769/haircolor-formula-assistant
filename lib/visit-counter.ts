import { Redis } from "@upstash/redis";

const VISIT_COUNTER_KEY = "haircolor:homepage:unique-visits";

let redisClient: Redis | null = null;

function getVisitCounterEnv() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  return { token, url };
}

export function hasVisitCounterConfig() {
  const { token, url } = getVisitCounterEnv();

  return Boolean(url && token);
}

function getRedisClient() {
  const { token, url } = getVisitCounterEnv();

  if (!url || !token) {
    return null;
  }

  redisClient ??= new Redis({
    token,
    url,
  });

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
