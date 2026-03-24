import { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useEventListener } from "expo";
import { type VideoPlayer, type SubtitleTrack } from "expo-video";

type CaptionPickerProps = {
  player: VideoPlayer;
};

export function CaptionPicker({ player }: CaptionPickerProps) {
  const [tracks, setTracks] = useState<SubtitleTrack[]>([]);
  const [active, setActive] = useState<SubtitleTrack | null>(null);

  useEventListener(player, "sourceLoad", ({ availableSubtitleTracks }) => {
    setTracks(availableSubtitleTracks);
  });

  const select = (track: SubtitleTrack | null) => {
    player.subtitleTrack = track;
    setActive(track);
  };

  if (tracks.length === 0) return null;

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.chip, !active && styles.chipActive]}
        onPress={() => select(null)}
      >
        <Text style={styles.chipText}>Off</Text>
      </Pressable>
      {tracks.map((t) => (
        <Pressable
          key={t.language}
          style={[
            styles.chip,
            active?.language === t.language && styles.chipActive,
          ]}
          onPress={() => select(t)}
        >
          <Text style={styles.chipText}>{t.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#1a1a1a",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: "#FF6B00" },
  chipText: { color: "#fff", fontSize: 13 },
});
