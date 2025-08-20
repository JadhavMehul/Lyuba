import { View, Text, TextStyle,StyleSheet,StyleProp } from 'react-native'
import React, { FC } from 'react'
import { Fonts } from '@utils/Constants'



interface Props {
  fontFamily?: Fonts;
  fontSize?: number;
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  numberOfLines?: number;
  // onLayout?: (event: object) => void
}

const TextComponent:FC<Props> = ( {
  fontFamily = Fonts.Poppins_Regular_400,
  fontSize,
  style,
  children,
  numberOfLines,
  // onLayout,
  ...props
}) => {
  


  return (
   
      <Text
      style={[
        styles.text,
        {color: '#000000' , fontSize, fontFamily},
        
        style


      ]}
      numberOfLines={numberOfLines !== undefined ? numberOfLines: undefined}
      >{children}</Text>
    
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'left'
  }
 })

export default TextComponent