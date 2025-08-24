import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextStyle,
  StyleProp,
  Modal,
  Pressable,
  findNodeHandle,
  UIManager,
} from "react-native";
import { Fonts } from "@utils/Constants";
import Icon from "react-native-vector-icons/FontAwesome";
import TextComponent from "./TextComponent";

interface Props {
  options: string[];
  placeholder?: string;
  value?: string;
  onSelect: (val: string) => void;
  style?: StyleProp<TextStyle>;
}

export default function DropdownField({
  options,
  placeholder = "Dropdown",
  value,
  onSelect,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [openAbove, setOpenAbove] = useState(false);
  const buttonRef = useRef<View>(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          // Check available space below
          const screenHeight = Dimensions.get("window").height;
          const spaceBelow = screenHeight - (y + height);
          const shouldOpenAbove = spaceBelow < 200; // if less than 200px below, open upwards

          setDropdownPos({ x, y, width, height });
          setOpenAbove(shouldOpenAbove);
          setOpen(!open);
        });
      }
    }
  };

  return (
    <>
      {/* Input-like button */}
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.input, style]}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <TextComponent style={[styles.text, !value && { color: "grey" }]}>
          {value || placeholder}
        </TextComponent>
        <Icon
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="grey"
        />
      </TouchableOpacity>

      {/* Dropdown modal */}
      <Modal visible={open} transparent animationType="none">
        {/* Full-screen overlay for outside clicks */}
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          {/* Empty Pressable just to capture outside clicks */}
        </Pressable>

        {/* Dropdown positioned relative to button */}
        <View
          style={[
            styles.dropdown,
            {
              position: "absolute",
              top: openAbove
                ? dropdownPos.y - 180 - 6 // open above
                : dropdownPos.y + dropdownPos.height + 6, // open below
              left: dropdownPos.x,
              width: dropdownPos.width,
              maxHeight: 180,
            },
          ]}
        >
          <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <TextComponent style={styles.optionText}>{item}</TextComponent>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular_400,
    color: "#000000",
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFB6C1",
    borderRadius: 12,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular_400,
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FFB6C1",
    borderRadius: 12,
    elevation: 6,
    zIndex: 9999,
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular_400,
    color: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});
