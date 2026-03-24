import { useEventListener } from "expo";
import { useCallback, useRef } from "react";
import type { VideoPlayer } from "expo-video";

type OnProgress = (currentTime: number, duration: number) => void;

export function useProgressTracking(
  player: VideoPlayer,
  onProgress: OnProgress,
  /** Only report every N seconds to avoid hammering your backend */
  throttleSeconds = 5,
) {
  const lastReported = useRef(0);

  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    if (Math.abs(currentTime - lastReported.current) >= throttleSeconds) {
      lastReported.current = currentTime;
      onProgress(currentTime, player.duration);
    }
  });
}
