import { NextRequest, NextResponse } from "next/server";
import { redis, redisConfigured } from "@/lib/redis";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

const COUNTS_KEY = "humss-tanada:hearts:counts";
const VOTERS_PREFIX = "humss-tanada:hearts:by:";

const MAX_KEY_LENGTH = 200;
const MAX_BATCH_SIZE = 500;

// Used only when Redis env vars are not set yet (local testing).
const memoryCounts = new Map<string, number>();
const memoryVoters = new Map<string, Set<string>>();

function isValidItemKey(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_KEY_LENGTH;
}

function isValidVisitorId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 100;
}

/**
 * GET /api/hearts            -> { counts: { [itemKey]: number } } for every item ever hearted
 * GET /api/hearts?keys=a,b,c -> { counts: { a: number, b: number, c: number } } for just those keys
 *
 * The second form lets a page with hundreds of gallery items fetch counts
 * for only what is currently rendered, instead of pulling the whole map.
 */
export async function GET(req: NextRequest) {
  const keysParam = req.nextUrl.searchParams.get("keys");
  const requestedKeys = keysParam
    ? keysParam.split(",").map((k) => k.trim()).filter(isValidItemKey).slice(0, MAX_BATCH_SIZE)
    : null;

  if (!redisConfigured || !redis) {
    const counts: Record<string, number> = {};
    const source = requestedKeys ?? Array.from(memoryCounts.keys());
    for (const key of source) {
      counts[key] = memoryCounts.get(key) ?? 0;
    }
    return NextResponse.json({ counts });
  }

  const all = (await redis.hgetall<Record<string, number>>(COUNTS_KEY)) ?? {};

  const counts: Record<string, number> = {};
  const source = requestedKeys ?? Object.keys(all);
  for (const key of source) {
    counts[key] = Number(all[key] ?? 0) || 0;
  }
  return NextResponse.json({ counts });
}

/**
 * POST /api/hearts { itemKey, visitorId }
 *
 * Toggles this visitor's heart on the given item:
 *  - not hearted yet by this visitor -> add it, count +1
 *  - already hearted by this visitor -> remove it, count -1
 *
 * Every visitor's browser carries a stable random id (see lib/visitorId.ts,
 * shared with the site-wide like counter), and Redis remembers, per item,
 * which ids have hearted it -- the same "who already acted" pattern the
 * site-wide like counter uses, just keyed per item instead of once for the
 * whole site. This is what makes counts shared and persistent across every
 * visitor and every device, rather than only remembered on one browser.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = await checkRateLimit(`hearts:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const itemKey = body?.itemKey;
  const visitorId = body?.visitorId;

  if (!isValidItemKey(itemKey)) {
    return NextResponse.json({ error: "Invalid item key." }, { status: 400 });
  }
  if (!isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "Invalid visitor id." }, { status: 400 });
  }

  if (!redisConfigured || !redis) {
    const voters = memoryVoters.get(itemKey) ?? new Set<string>();
    const hadHearted = voters.has(visitorId);

    if (hadHearted) {
      voters.delete(visitorId);
      memoryCounts.set(itemKey, Math.max(0, (memoryCounts.get(itemKey) ?? 0) - 1));
    } else {
      voters.add(visitorId);
      memoryCounts.set(itemKey, (memoryCounts.get(itemKey) ?? 0) + 1);
    }
    memoryVoters.set(itemKey, voters);

    return NextResponse.json({
      count: memoryCounts.get(itemKey) ?? 0,
      hearted: !hadHearted,
    });
  }

  const votersKey = `${VOTERS_PREFIX}${itemKey}`;
  const alreadyHearted = await redis.sismember(votersKey, visitorId);

  let count: number;
  let hearted: boolean;

  if (alreadyHearted) {
    await redis.srem(votersKey, visitorId);
    count = await redis.hincrby(COUNTS_KEY, itemKey, -1);
    if (count < 0) {
      // Defensive floor: counts should never go negative even if data
      // ever drifts (e.g. manual Redis edits during testing).
      await redis.hset(COUNTS_KEY, { [itemKey]: 0 });
      count = 0;
    }
    hearted = false;
  } else {
    await redis.sadd(votersKey, visitorId);
    count = await redis.hincrby(COUNTS_KEY, itemKey, 1);
    hearted = true;
  }

  return NextResponse.json({ count, hearted });
}
