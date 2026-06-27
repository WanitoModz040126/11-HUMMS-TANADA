"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";

type MusicContextValue = {
  entered: boolean;
  muted: boolean;
  enterAndPlay: () => void;
  toggleMute: () => void;
  duckForVideo: () => void;
  restoreAfterVideo: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const wasPlayingBeforeDuck = useRef(false);

  const enterAndPlay = useCallback(() => {
    setEntered(true);
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.45;
    el.play().catch(() => {
      // Some browsers may still block this; the visible speaker toggle
      // lets the visitor start playback manually instead.
    });
  }, []);

  const toggleMute = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) {
      el.play().catch(() => {});
    }
  }, []);

  const duckForVideo = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    wasPlayingBeforeDuck.current = !el.paused;
    el.pause();
  }, []);

  const restoreAfterVideo = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (wasPlayingBeforeDuck.current) {
      el.play().catch(() => {});
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{ entered, muted, enterAndPlay, toggleMute, duckForVideo, restoreAfterVideo }}
    >
      <audio ref={audioRef} src="/music/bgm.mp3" loop preload="auto" />
      {children}
    </MusicContext.Provider>
  );
}
