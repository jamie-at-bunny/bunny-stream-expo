import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { VideoView, type VideoPlayer } from "expo-video";

type VideoPosterProps = {
  player: VideoPlayer;
  posterUri?: string;
  blurhash?: string | null;
};

export function VideoPoster({ player, posterUri, blurhash }: VideoPosterProps) {
  const [showCover, setShowCover] = useState(true);

  return (
    <View style={styles.wrapper}>
      {showCover && posterUri && (
        <Image
          source={{ uri: posterUri }}
          placeholder={blurhash ? { blurhash } : undefined}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      )}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        allowsPictureInPicture
        fullscreenOptions={{ enable: true }}
        onFirstFrameRender={() => setShowCover(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
});
