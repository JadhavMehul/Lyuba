import React from "react";
import { TouchableOpacity, Image, StyleSheet, ImageSourcePropType, ViewStyle, TextStyle } from "react-native";
import TextComponent from "@components/global/TextComponent";
import { Fonts } from "@utils/Constants";

type AuthButtonProps = {
  text: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const AuthButton = ({ text, icon, onPress, style, textStyle }: AuthButtonProps) => {
  return (
    <TouchableOpacity style={[styles.authButton, style]} onPress={onPress} activeOpacity={0.7}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <TextComponent style={[styles.text, textStyle]}>{text}</TextComponent>
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
    authButton: {
        paddingVertical: 11,
        paddingHorizontal: 16,
        gap: 24,
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 12,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
      },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    fontFamily: Fonts.Poppins_Regular_400,
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
  },
});
