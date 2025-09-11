import React, { useState, useEffect } from "react";import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

type PhotoBodyProps = {
  initialState?: boolean; // true = add icon, false = delete icon
  onToggle?: (isAddIcon: boolean) => void;
};

export default function PhotoBody({ initialState = true, onToggle }: PhotoBodyProps) {
  const [toggle, setToggle] = useState(initialState);

  const handlePress = () => {
    const newState = !toggle;
    setToggle(newState);
    onToggle?.(newState);
  };
    useEffect(() => {
        setToggle(initialState);
      }, [initialState]);

  return (
    <View style={styles.photocontainer}>
      <View style={styles.toggleicon}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={
              toggle
                ? require("@assets/icons/addicon.png")
                : require("@assets/icons/deleteicon.png")
            }
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
    photocontainer: {
        width: 100,
        height: 129,
        backgroundColor: '#FFE3E8',
        borderRadius: 8,
        position: 'relative',
    },
    toggleicon: {
        position: 'absolute',
        bottom: -12,
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: 24,
        height: 24,

    },
});
