import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";

const CustomToggle = () => {
  const [isOn, setIsOn] = useState(false);
  const translateX = new Animated.Value(isOn ? 22 : 2);

  const toggleSwitch = () => {
    Animated.timing(translateX, {
      toValue: isOn ? 2 : 22,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsOn(!isOn);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.container,
        { backgroundColor: isOn ? "#FF6B6B" : "#EEDDDD" }, // your theme
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default CustomToggle;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 28,
    borderRadius: 20,
    justifyContent: "center",
    padding: 3,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    elevation: 2,
  },
});