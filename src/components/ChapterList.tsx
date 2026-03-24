import { FlatList, Pressable, Text, StyleSheet } from "react-native";
import type { VideoPlayer } from "expo-video";
import { formatTime, type BunnyChapter } from "../lib/bunny";

type ChapterListProps = {
  chapters: BunnyChapter[];
  player: VideoPlayer;
};

export function ChapterList({ chapters, player }: ChapterListProps) {
  return (
    <FlatList
      horizontal
      data={chapters}
      keyExtractor={(c) => String(c.start)}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          style={styles.chip}
          onPress={() => {
            player.currentTime = item.start;
            if (!player.playing) player.play();
          }}
        >
          <Text style={styles.chipTime}>{formatTime(item.start)}</Text>
          <Text style={styles.chipTitle}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },
  chipTime: { color: "#FF6B00", fontSize: 12, fontWeight: "600" },
  chipTitle: { color: "#ddd", fontSize: 13, marginTop: 2 },
});
