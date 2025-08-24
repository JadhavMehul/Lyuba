// RadarAnimation.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const SIZES = [0.32, 0.52, 0.72]; // circle sizes
const GREY = "#BDBDBD";
const PINK = "#FF6B81";

const RadarAnimation: React.FC = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 3,
          duration: 2000, // total = 3 steps × 600ms
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0, // reset everything to grey
          duration: 100,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const ringStyle = (sizePct: number, color: any) => {
    const sz = width * sizePct;
    return {
      width: sz,
      height: sz,
      borderRadius: sz / 2,
      borderColor: color,
    };
  };

  return (
    <View style={styles.radar}>
      {/* Outer */}
      <Animated.View
        style={[
          styles.ring,
          ringStyle(
            SIZES[2],
            progress.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [GREY, GREY, PINK, PINK],
            })
          ),
        ]}
      />
      {/* Middle */}
      <Animated.View
        style={[
          styles.ring,
          ringStyle(
            SIZES[1],
            progress.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [GREY, PINK, PINK, PINK],
            })
          ),
        ]}
      />
      {/* Inner */}
      <Animated.View
        style={[
          styles.ring,
          ringStyle(
            SIZES[0],
            progress.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [GREY, PINK, PINK, PINK],
            })
          ),
        ]}
      />
      <Text style={styles.pin}>📍</Text>
    </View>
  );
};

export default RadarAnimation;

const styles = StyleSheet.create({
  radar: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    height: width * 0.8,
  },
  ring: {
    position: "absolute",
    borderWidth: Math.max(6, width * 0.015),
  },
  pin: {
    position: "absolute",
    fontSize: 28,
  },
});
