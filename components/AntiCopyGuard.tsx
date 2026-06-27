"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight deterrents against casual copying: blocks the right-click
 * menu and the most common "view/save source" keyboard shortcuts, and
 * shows a small notice when someone tries.
 *
 * This is a deterrent, not a lock. Anything rendered in a browser can
 * still be read through the browser's normal dev tools or network panel,
 * that is true of every website on the internet. This component just
 * removes the lazy, one-click ways of grabbing the page.
 */
export default function AntiCopyGuard() {
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const flash = () => {
      setNotice(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setNotice(false), 1800);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      flash();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const blockedCombo =
        (e.ctrlKey || e.metaKey) &&
        ["u", "s", "U", "S"].includes(e.key);
      const blockedDevtools =
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(e.key));

      if (blockedCombo || blockedDevtools) {
        e.preventDefault();
        flash();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      aria-hidden={!notice}
      className={`fixed bottom-5 right-5 z-[200] rounded-card border border-ink-line bg-ink-surface px-4 py-3 text-sm text-parchment shadow-soft transition-all duration-300 ${
        notice ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      }`}
    >
      This content belongs to 11 - HUMSS (TAÑADA).
    </div>
  );
}
