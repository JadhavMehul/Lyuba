import { Fonts } from '@utils/Constants';
import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

interface Props extends TextInputProps  {
  style?: StyleProp<TextStyle>;
};

export default function InputField({ style, ...rest }: Props) {
  return <TextInput style={[styles.input, style]} placeholderTextColor="grey" {...rest} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular_400,
    color: '#000000',
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    borderRadius: 12,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
});