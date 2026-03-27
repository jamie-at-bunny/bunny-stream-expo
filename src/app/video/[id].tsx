import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";
import { useLocalSearchParams } from "expo-router";

import {
  getVideo,
  hlsUrl,
  thumbnailUrl,
  formatTime,
  type BunnyVideo as BunnyVideoMeta,
} from "../../lib/bunny";
import { ChapterList } from "../../components/ChapterList";
import { CaptionPicker } from "../../components/CaptionPicker";

export default function VideoScreen() {
  const { id: videoId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [meta, setMeta] = useState<BunnyVideoMeta | null>(null);

  useEffect(() => {
    getVideo(videoId).then(setMeta).catch(console.error);
  }, [videoId]);

  const source: VideoSource = {
    uri: hlsUrl(videoId),
    contentType: "hls",
    metadata: {
      title: meta?.title ?? "Loading…",
      artwork: meta?.thumbnailFileName
        ? thumbnailUrl(videoId, meta.thumbnailFileName)
        : undefined,
    },
  };

  const player = useVideoPlayer(source, (p) => {
    p.timeUpdateEventInterval = 1;
    p.staysActiveInBackground = true;
    p.showNowPlayingNotification = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // Progress tracking: save to your backend here
  useEventListener(player, "timeUpdate", ({ currentTime }) => {
    // e.g. saveProgress(videoId, currentTime, player.duration)
  });

  return (
    <ScrollView style={styles.screen}>
      {/* Video player */}
      <VideoView
        player={player}
        style={{ width, height: width * (9 / 16) }}
        contentFit="contain"
        allowsPictureInPicture
        fullscreenOptions={{ enable: true }}
      />

      {/* Info */}
      {meta && (
        <View style={styles.info}>
          <Text style={styles.title}>{meta.title}</Text>
          {meta.description && (
            <Text style={styles.desc}>{meta.description}</Text>
          )}
          <Text style={styles.meta}>
            {formatTime(meta.length)} · {meta.width}×{meta.height} ·{" "}
            {meta.availableResolutions ?? "processing"}
          </Text>
        </View>
      )}

      {/* Play / Pause */}
      <Pressable
        style={styles.playBtn}
        onPress={() => (isPlaying ? player.pause() : player.play())}
      >
        <Text style={styles.playBtnText}>
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </Pressable>

      {/* Captions */}
      <CaptionPicker player={player} />

      {/* Chapters */}
      {meta?.chapters && meta.chapters.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chapters</Text>
          <ChapterList chapters={meta.chapters} player={player} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0a0a0a" },
  info: { padding: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  desc: { color: "#999", fontSize: 14, marginTop: 4 },
  meta: { color: "#666", fontSize: 12, marginTop: 4 },
  playBtn: {
    alignSelf: "center",
    backgroundColor: "#FF6B00",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  playBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  section: { paddingHorizontal: 16, marginTop: 12 },
  sectionTitle: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
});
