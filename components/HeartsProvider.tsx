"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getVisitorId } from "@/lib/visitorId";

type HeartsContextValue = {
  ready: boolean;
  /** Whether *this visitor* has hearted the given item. */
  isHearted: (key: string) => boolean;
  /** The total number of visitors who have hearted the given item. */
  getCount: (key: string) => number;
  /** Toggles this visitor's heart on the given item; updates the shared total. */
  toggleHeart: (key: string) => void;
  /**
   * Lets a section register which item keys it is currently displaying,
   * so their counts get fetched in one batched request instead of one
   * request per card. Safe to call on every render; duplicates are
   * deduplicated internally.
   */
  registerKeys: (keys: string[]) => void;
};

const HeartsContext = createContext<HeartsContextValue | null>(null);

const HEARTED_BY_ME_KEY = "humss-tanada-hearted-by-me";

function readHeartedByMe(): Set<string> {
  try {
    const raw = localStorage.getItem(HEARTED_BY_ME_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeHeartedByMe(set: Set<string>) {
  try {
    localStorage.setItem(HEARTED_BY_ME_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Storage may be full or disabled (private browsing); the heart
    // button itself still works against the server, it just won't be
    // pre-filled as "hearted by me" on the next page load in that case.
  }
}

export function useHearts() {
  const ctx = useContext(HeartsContext);
  if (!ctx) throw new Error("useHearts must be used inside HeartsProvider");
  return ctx;
}

export function HeartsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [heartedByMe, setHeartedByMe] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  const pendingKeys = useRef<Set<string>>(new Set());
  const fetchedKeys = useRef<Set<string>>(new Set());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHeartedByMe(readHeartedByMe());
    setReady(true);
  }, []);

  const flushPendingKeys = useCallback(() => {
    const keys = Array.from(pendingKeys.current);
    pendingKeys.current.clear();
    if (keys.length === 0) return;

    keys.forEach((k) => fetchedKeys.current.add(k));

    fetch(`/api/hearts?keys=${encodeURIComponent(keys.join(","))}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.counts) {
          setCounts((prev) => ({ ...prev, ...data.counts }));
        }
      })
      .catch(() => {
        // Network hiccup: counts for these keys simply stay at their
        // last known value (0 on first load) until the next interaction.
      });
  }, []);

  const registerKeys = useCallback(
    (keys: string[]) => {
      let hasNew = false;
      for (const key of keys) {
        if (!fetchedKeys.current.has(key) && !pendingKeys.current.has(key)) {
          pendingKeys.current.add(key);
          hasNew = true;
        }
      }
      if (!hasNew) return;

      if (flushTimer.current) clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(flushPendingKeys, 60);
    },
    [flushPendingKeys]
  );

  const isHearted = useCallback((key: string) => heartedByMe.has(key), [heartedByMe]);
  const getCount = useCallback((key: string) => counts[key] ?? 0, [counts]);

  const toggleHeart = useCallback((key: string) => {
    // Optimistic update so the tap feels instant; reconciled with the
    // server's response right after.
    const wasHearted = heartedByMe.has(key);

    setHeartedByMe((prev) => {
      const next = new Set<string>(prev);
      if (wasHearted) next.delete(key);
      else next.add(key);
      writeHeartedByMe(next);
      return next;
    });

    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) + (wasHearted ? -1 : 1)),
    }));

    const visitorId = getVisitorId();

    fetch("/api/hearts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemKey: key, visitorId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((data) => {
        // Reconcile with the server's authoritative count and hearted
        // state, in case our optimistic guess and the server disagree
        // (e.g. a rapid double-tap, or another tab toggling first).
        if (typeof data?.count === "number") {
          setCounts((prev) => ({ ...prev, [key]: data.count }));
        }
        if (typeof data?.hearted === "boolean") {
          setHeartedByMe((prev) => {
            const next = new Set<string>(prev);
            if (data.hearted) next.add(key);
            else next.delete(key);
            writeHeartedByMe(next);
            return next;
          });
        }
      })
      .catch(() => {
        // Roll the optimistic update back on failure.
        setHeartedByMe((prev) => {
          const next = new Set<string>(prev);
          if (wasHearted) next.add(key);
          else next.delete(key);
          writeHeartedByMe(next);
          return next;
        });
        setCounts((prev) => ({
          ...prev,
          [key]: Math.max(0, (prev[key] ?? 0) + (wasHearted ? 1 : -1)),
        }));
      });
  }, [heartedByMe]);

  return (
    <HeartsContext.Provider
      value={{ ready, isHearted, getCount, toggleHeart, registerKeys }}
    >
      {children}
    </HeartsContext.Provider>
  );
}
