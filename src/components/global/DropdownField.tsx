import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextStyle,
  StyleProp,
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

  return (
    <View style={{ width: "100%" }}>
      {/* Input-like button */}
      <TouchableOpacity
        style={[styles.input, style]}
        onPress={() => setOpen(!open)}
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

      {/* Dropdown list */}
      {open && (
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
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
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    // width: "100%",
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
    marginTop: 6,
    maxHeight: 180,
    elevation: 6,
    zIndex: 99999,
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
});
