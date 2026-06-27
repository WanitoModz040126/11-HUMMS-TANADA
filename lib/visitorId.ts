const VISITOR_KEY = "humss-tanada-visitor-id";

/**
 * Returns this browser's stable random visitor id, creating and saving one
 * on first call. Used to let the server recognize "this is the same
 * visitor" across requests without an account system -- the same id is
 * shared by the site-wide like button (/api/like) and the per-item hearts
 * system (/api/hearts), so a visitor only ever has one identity, not a
 * different random id per feature.
 */
export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      crypto.randomUUID?.() ??
      `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}
