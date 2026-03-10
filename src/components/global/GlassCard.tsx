import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type Props = {
  children: React.ReactNode;
  style?: any;
};

export default function ShinyCard({ children, style }: Props) {
  return (
    <LinearGradient
      colors={[
        "rgba(255,127,127,0.25)",
        "rgba(255,127,127,0.12)",
        "rgba(255,127,127,0.06)"
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.card, style]}
    >
      {/* Top Shine Effect */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.5)",
          "rgba(255,255,255,0.1)",
          "transparent"
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.shine}
      />

      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 14,
    overflow: "hidden",

    borderWidth: 1.5,
    borderColor: "#FF7F7F",
    marginBottom:20,
  },

  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
});