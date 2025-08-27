import React from "react";
import { TouchableOpacity, Image, StyleSheet, ViewStyle, ImageStyle, TextStyle } from "react-native";
import TextComponent from "@components/global/TextComponent";
import { Fonts } from "@utils/Constants";

type OptionProps = {
    label: string;
    value: string;
    selectedOption: string;
    onPress: (option: string) => void;
    defaultIcon: any;
    selectedIcon: any;
};

const SelectableOption = ({
    label,
    value,
    selectedOption,
    onPress,
    defaultIcon,
    selectedIcon,
}: OptionProps) => {
    const isSelected = selectedOption === value;

    return (
        <TouchableOpacity
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => onPress(value)}
        >
            <Image
                source={isSelected ? selectedIcon : defaultIcon}
                style={styles.image2}
            />
            <TextComponent
                style={[styles.text, isSelected && styles.selectedText]}
            >
                {label}
            </TextComponent>
        </TouchableOpacity>
    );
};

export default SelectableOption;

const styles = StyleSheet.create({


    option: {
        minWidth: 140,
        height: 150,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFB6C1',
        alignItems: 'center',
        justifyContent: 'center',

    },
    selectedOption: {
        borderColor: '#FFB6C1',
        backgroundColor: '#FFE3E8',
        shadowColor: "#FF7F7F",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Medium_500,
    },
    selectedText: {
        color: '#FF7F7F',
    },
    image2: {
        width: 100,
        height: 100,
    },
});
