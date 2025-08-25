import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@features/welcome_screens/WelcomeScreen';
import loginScreen from '@features/auth/loginScreen';
import registerScreen1 from '@features/auth/registerScreen1';
import registerScreen2 from '@features/auth/registerScreen2';
import registerScreen3 from '@features/auth/registerScreen3';
import registerScreen5 from '@features/auth/registerScreen5';
import registerScreen6 from '@features/auth/registerScreen6';
import registerScreen7 from '@features/auth/registerScreen7';
import registerScreen4 from '@features/auth/registerScreen4';
import registerScreen4_1 from '@features/auth/registerScreen4_1';
import registerScreen4_2 from '@features/auth/registerScreen4_2';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
        <Stack.Screen name="loginScreen" component={loginScreen}/>
        <Stack.Screen name="registerScreen1" component={registerScreen1}/>
        <Stack.Screen name="registerScreen2" component={registerScreen2}/>
        <Stack.Screen name="registerScreen3" component={registerScreen3}/>
        <Stack.Screen name="registerScreen4" component={registerScreen4}/>
        <Stack.Screen name="registerScreen4_1" component={registerScreen4_1}/>
        <Stack.Screen name="registerScreen4_2" component={registerScreen4_2}/>
        <Stack.Screen name="registerScreen5" component={registerScreen5}/>
        <Stack.Screen name="registerScreen6" component={registerScreen6}/>
        <Stack.Screen name="registerScreen7" component={registerScreen7}/>

        

      </Stack.Navigator>
      
    </NavigationContainer>
  )
}

export default App