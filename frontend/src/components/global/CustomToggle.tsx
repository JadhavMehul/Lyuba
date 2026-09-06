import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";

type Props = {
  // Omit both to get the old, purely-decorative uncontrolled behavior.
  value?: boolean;
  onValueChange?: (next: boolean) => void;
};

const CustomToggle = ({ value, onValueChange }: Props) => {
  const [internalOn, setInternalOn] = useState(false);
  const isControlled = value !== undefined;
  const isOn = isControlled ? value : internalOn;

  const translateX = useRef(new Animated.Value(isOn ? 22 : 2)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? 22 : 2,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn, translateX]);

  const toggleSwitch = () => {
    const next = !isOn;
    if (!isControlled) setInternalOn(next);
    onValueChange?.(next);
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
