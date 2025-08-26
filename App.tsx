import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@features/welcome_screens/WelcomeScreen';
import LoginScreen from '@features/auth/LoginScreen';
import registerScreen1 from '@features/auth/registerScreen1';
import registerScreen2 from '@features/auth/registerScreen2';
import registerScreen3 from '@features/auth/registerScreen3';
import registerScreen5 from '@features/auth/registerScreen5';
import registerScreen6 from '@features/auth/registerScreen6';
import registerScreen7 from '@features/auth/registerScreen7';
import registerScreen4 from '@features/auth/registerScreen4';
import registerScreen4_1 from '@features/auth/registerScreen4_1';
import registerScreen4_2 from '@features/auth/registerScreen4_2';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // 1️⃣ Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '493807442216-34j4k666eicmjtuptdcj2dp3te9js4es.apps.googleusercontent.com',
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });

    // 2️⃣ Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      if (initializing) setInitializing(false);

      // 3️⃣ Navigate based on user login status
      if (u) {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "registerScreen1" }],
        });
        // subscribeToTopic(); // Uncomment if you have this function
      } else {
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "loginScreen" }],
        });
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
        <Stack.Screen name="loginScreen" component={LoginScreen}/>
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