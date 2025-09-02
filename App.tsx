import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@features/welcome_screens/WelcomeScreen';
import LoginScreen from '@features/auth/LoginScreen';
import RegisterScreen1 from '@features/auth/RegisterScreen1';
import RegisterScreen2 from '@features/auth/RegisterScreen2';
import RegisterScreen3 from '@features/auth/RegisterScreen3';
import RegisterScreen5 from '@features/auth/RegisterScreen5';
import RegisterScreen6 from '@features/auth/RegisterScreen6';
import RegisterScreen7 from '@features/auth/RegisterScreen7';
import RegisterScreen4 from '@features/auth/RegisterScreen4';
import RegisterScreen4_1 from '@features/auth/RegisterScreen4_1';
import RegisterScreen4_2 from '@features/auth/RegisterScreen4_2';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import HomeScreen from '@features/home_screen/HomeScreen';
import { ActivityIndicator } from 'react-native';
import RegisterScreen8 from '@features/auth/RegisterScreen8';

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
    const unsubscribe = auth().onAuthStateChanged(async (u) => {
      setUser(u);

      if (initializing) {
        // First time: just finish initializing, don't navigate yet
        setInitializing(false);
      } else {
        // After first run: navigate based on auth state
        if (u) {
          try {
            const idToken = await u.getIdToken()

            const res = await fetch('http://10.0.2.2:3000/api/auth/authenticateUser', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            })

            const data = await res.json()

            if (data?.response.profileComplete === true) {
              navigationRef.current?.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
              })
            } else {
              navigationRef.current?.reset({
                index: 0,
                routes: [{ name: 'RegisterScreen1', params: { userData: data.response.user } }],
              })
            }
          } catch (error) {
            console.log('Profile check failed:', error)
            navigationRef.current?.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          }
        } else {
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          });
        }
      }
    });

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) return <ActivityIndicator size={'large'} />;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="RegisterScreen1" component={RegisterScreen1}/>
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2}/>
        <Stack.Screen name="RegisterScreen3" component={RegisterScreen3}/>
        <Stack.Screen name="RegisterScreen4" component={RegisterScreen4}/>
        <Stack.Screen name="RegisterScreen4_1" component={RegisterScreen4_1}/>
        <Stack.Screen name="RegisterScreen4_2" component={RegisterScreen4_2}/>
        <Stack.Screen name="RegisterScreen5" component={RegisterScreen5}/>
        <Stack.Screen name="RegisterScreen6" component={RegisterScreen6}/>
        <Stack.Screen name="RegisterScreen7" component={RegisterScreen7}/>
        <Stack.Screen name="RegisterScreen8" component={RegisterScreen8}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  )
}

export default App