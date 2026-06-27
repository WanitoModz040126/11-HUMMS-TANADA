import { NextRequest, NextResponse } from "next/server";
import { redis, redisConfigured } from "@/lib/redis";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

const LIKES_KEY = "humss-tanada:likes:total";
const LIKERS_KEY = "humss-tanada:likes:visitors";

// Used only when Redis env vars are not set yet (local testing).
let memoryTotal = 0;
const memoryVisitors = new Set<string>();

export async function GET() {
  if (!redisConfigured || !redis) {
    return NextResponse.json({ total: memoryTotal });
  }
  const total = (await redis.get<number>(LIKES_KEY)) ?? 0;
  return NextResponse.json({ total });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = await checkRateLimit(`like:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const visitorId = body?.visitorId;

  if (!visitorId || typeof visitorId !== "string" || visitorId.length > 100) {
    return NextResponse.json({ error: "Invalid visitor id." }, { status: 400 });
  }

  if (!redisConfigured || !redis) {
    if (!memoryVisitors.has(visitorId)) {
      memoryVisitors.add(visitorId);
      memoryTotal += 1;
    }
    return NextResponse.json({ total: memoryTotal });
  }

  const alreadyLiked = await redis.sismember(LIKERS_KEY, visitorId);

  if (!alreadyLiked) {
    await redis.sadd(LIKERS_KEY, visitorId);
    await redis.incr(LIKES_KEY);
  }

  const total = (await redis.get<number>(LIKES_KEY)) ?? 0;
  return NextResponse.json({ total });
}
