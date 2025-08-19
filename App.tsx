import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@features/welcome_screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>

      </Stack.Navigator>
      
    </NavigationContainer>
  )
}

export default App