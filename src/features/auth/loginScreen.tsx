import { View, Text } from 'react-native'
import React from 'react'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'

const loginScreen = () => {
  return (
    <View>
      <Text>loginScreen</Text>
      <TextComponent
        fontFamily={Fonts.Poppins_Medium_500}
        fontSize={54}
        style={{ color: '#3b82f6' }}
        numberOfLines={2}
      >
        This text uses medium font, blue color, size 16, and will wrap to 2 lines max.
      </TextComponent>
    </View>
  )
}

export default loginScreen