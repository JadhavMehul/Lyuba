import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import TextComponent from "@components/global/TextComponent";
import { Fonts } from "@utils/Constants";

interface ProfileCardProps {
  image: ImageSourcePropType;
  name: string;
  role: string;
}

export default function ProfileCard({ image, name, role }: ProfileCardProps) {
    const truncateText = (text: string, maxChars = 10) => {
        if (text.length > maxChars) {
          return text.slice(0, maxChars) + "...";
        }
        return text;
      };
  return (
    <View style={styles.imagecontainer}>
      <Image source={image} style={styles.image} resizeMode="cover" />

      <View style={styles.textofcard}>
        <TextComponent style={styles.tt1}>{truncateText(name)}</TextComponent>
        <TextComponent style={styles.tt2}>{truncateText(role)}</TextComponent>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

    imagecontainer: {
        zIndex: 1,
        width: 160,
        height: 190,
        backgroundColor: "#ffe6eb",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: 'relative',

    },
    image: {
        width: "100%",
        height: "100%",
    },
    tt1: { fontFamily: Fonts.Poppins_SemiBold_600, fontSize: 18, color: '#FFFFFF' },
    tt2: { fontFamily: Fonts.Poppins_Medium_500, fontSize: 14, color: '#FFFFFF' },
    textofcard: { position: 'absolute', bottom: 0, width: '100%', paddingLeft: 10, paddingBottom: 10 },
});
