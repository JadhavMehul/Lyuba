import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

type Props = {
  children: React.ReactNode;
  style?: any;
};

export default function ShinyCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>

      {/* Top Shine Effect */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.12)",
          "rgba(255,255,255,0.05)",
          "transparent"
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.shine}
      />

      {children}

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    width: "100%",
    borderRadius: 18,
    padding: 14,

    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.1)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",

  
  },

  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 45
  }

});