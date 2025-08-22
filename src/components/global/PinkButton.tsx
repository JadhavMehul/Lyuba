import { Fonts } from "@utils/Constants";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type PinkButtonProps = {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];    
  textStyle?: TextStyle;   
  disabled?: boolean;
};

const PinkButton = ({ text, onPress, style, textStyle,disabled }: PinkButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled} 
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: "#FF7F7F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "stretch",
  },
  text: {
    color: "#fff",
    fontSize: 20,
   fontFamily: Fonts.Poppins_SemiBold_600,
   textAlign: "center", 
  },
});

export default PinkButton;
