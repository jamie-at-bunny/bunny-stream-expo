import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";
import { useLocalSearchParams } from "expo-router";

import { getVideoMeta, type BunnyVideoMeta } from "../../lib/bunny";
import { ChapterList } from "../../components/ChapterList";
import { CaptionPicker } from "../../components/CaptionPicker";
import { useProgressTracking } from "../../hooks/useProgressTracking";

const PULL_ZONE = process.env.EXPO_PUBLIC_BUNNY_PULL_ZONE ?? "";
const LIBRARY_ID = process.env.EXPO_PUBLIC_BUNNY_LIBRARY_ID ?? "";
const API_KEY = process.env.EXPO_PUBLIC_BUNNY_API_KEY ?? "";

export default function VideoScreen() {
  const { id: videoId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [meta, setMeta] = useState<BunnyVideoMeta | null>(null);

  useEffect(() => {
    if (!videoId || !LIBRARY_ID || !API_KEY) return;
    getVideoMeta(LIBRARY_ID, videoId, API_KEY)
      .then(setMeta)
      .catch(console.error);
  }, [videoId]);

  const source: VideoSource = {
    uri: `https://${PULL_ZONE}/${videoId}/playlist.m3u8`,
    contentType: "hls",
    metadata: {
      title: meta?.title ?? "Loading…",
      artwork: meta?.thumbnailFileName
        ? `https://${PULL_ZONE}/${videoId}/${meta.thumbnailFileName}`
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

  useProgressTracking(player, (currentTime, duration) => {
    // Save to your backend
  });

  const videoHeight = width * (9 / 16);

  return (
    <ScrollView style={styles.screen}>
      <VideoView
        player={player}
        style={{ width, height: videoHeight }}
        contentFit="contain"
        allowsPictureInPicture
        fullscreenOptions={{ enable: true }}
      />

      {meta && (
        <View style={styles.info}>
          <Text style={styles.title}>{meta.title}</Text>
          {meta.description && (
            <Text style={styles.desc}>{meta.description}</Text>
          )}
        </View>
      )}

      <Pressable
        style={styles.playBtn}
        onPress={() => (isPlaying ? player.pause() : player.play())}
      >
        <Text style={styles.playBtnText}>{isPlaying ? "Pause" : "Play"}</Text>
      </Pressable>

      <CaptionPicker player={player} />

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
