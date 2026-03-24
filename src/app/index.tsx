import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  listVideos,
  thumbnailUrl,
  formatTime,
  type BunnyVideo,
} from "../lib/bunny";

export default function VideoListScreen() {
  const router = useRouter();
  const [videos, setVideos] = useState<BunnyVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listVideos()
      .then((data) => setVideos(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(v) => v.guid}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/video/${item.guid}`)}
        >
          <Image
            source={
              item.thumbnailFileName
                ? { uri: thumbnailUrl(item.guid, item.thumbnailFileName) }
                : undefined
            }
            placeholder={
              item.thumbnailBlurhash
                ? { blurhash: item.thumbnailBlurhash }
                : undefined
            }
            style={styles.thumbnail}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.cardBody}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {formatTime(item.length)} · {item.views} views
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#111",
    borderRadius: 10,
    overflow: "hidden",
  },
  thumbnail: {
    width: 160,
    height: 90,
    backgroundColor: "#222",
  },
  cardBody: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 15, fontWeight: "600" },
  meta: { color: "#777", fontSize: 12, marginTop: 4 },
});
