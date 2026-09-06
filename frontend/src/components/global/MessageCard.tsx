import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import TextComponent from "@components/global/TextComponent";
import { Fonts } from "@utils/Constants";

interface MessageCardProps {
  image: string;
  name: string;
  message: string;
  time: string;
  messageCount: number;
  onPress?: () => void;
}

export default function MessageCard({
  image,
  name,
  message,
  time,
  messageCount,
  onPress,
}: MessageCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.personmessage}>
        {/* Left side: Profile + Name + Role */}
        <View style={styles.leftSection}>
          <View style={styles.circleprofile}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.nameSection}>
            <TextComponent style={styles.title1}>{name}</TextComponent>
            <TextComponent style={styles.title2}>{message}</TextComponent>
          </View>
        </View>

        {/* Right side: Time + Message count */}
        <View style={styles.rightSection}>
          <TextComponent style={styles.timing}>{time}</TextComponent>
          {messageCount > 0 && (
            <View style={styles.circle}>
              <TextComponent style={styles.numberofmessage}>
                {messageCount}
              </TextComponent>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    leftSection: {
        flexDirection: 'row', gap: '10', justifyContent: 'center', alignItems: 'center'
    },

    nameSection: {
        flexDirection: 'column'
    },
    rightSection: {
        alignItems: 'flex-end'
    },
    personmessage: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    timing: {
        fontFamily: Fonts.Poppins_Bold_700, fontSize: 12, color: '#ADAFBB'
    },
    numberofmessage: {
        fontFamily: Fonts.Poppins_Bold_700, fontSize: 12, color: '#FFFFFF'
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FF7F7F",
    },
    circleprofile: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: '#FF7F7F',
        overflow: 'hidden'
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    title2: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
    title1: {
        fontFamily: Fonts.Poppins_Bold_700,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
});
