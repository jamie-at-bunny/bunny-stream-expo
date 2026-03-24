import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";

type BunnyVideoProps = {
  pullZone: string;
  videoId: string;
  title?: string;
  thumbnailFileName?: string;
};

export function BunnyVideo({
  pullZone,
  videoId,
  title,
  thumbnailFileName,
}: BunnyVideoProps) {
  const source: VideoSource = {
    uri: `https://${pullZone}/${videoId}/playlist.m3u8`,
    contentType: "hls",
    metadata: {
      title: title ?? "Untitled video",
      artist: "bunny.net",
      artwork: thumbnailFileName
        ? `https://${pullZone}/${videoId}/${thumbnailFileName}`
        : undefined,
    },
  };

  const player = useVideoPlayer(source, (p) => {
    p.staysActiveInBackground = true;
    p.showNowPlayingNotification = true;
  });

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        allowsPictureInPicture
        fullscreenOptions={{ enable: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  video: { flex: 1 },
});
