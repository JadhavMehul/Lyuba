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
import MessagesScreen from '@features/home_screen/MessagesScreen';
import LikeScreen from '@features/home_screen/LikeScreen';
import ProfileScreen from '@features/profile_screen/ProfileScreen';
import MessageScreen2 from '@features/home_screen/MessageScreen2';
import { ENV } from '@utils/Constants';
import OthersProfileScreen from '@features/profile_screen/OthersProfileScreen';
import SettingScreen from '@features/settingss/SettingScreen';
import EditProfile from '@features/settingss/EditProfile';
import EditImage from '@features/settingss/EditImage';
import NotificationScreen from '@features/settingss/NotificationScreen';
import BlockListScreen from '@features/settingss/BlockListScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // 1️⃣ Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '493807442216-34j4k666eicmjtuptdcj2dp3te9js4es.apps.googleusercontent.com',
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });

    // 2️⃣ Subscribe to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (u) => {
      if (u) {
        try {
          // Check backend for profile status BEFORE showing any screens
          const idToken = await u.getIdToken();
          const api = `${ENV.API_IP}:3000/api/auth/authenticateUser`;
          const res = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          const data = await res.json();
          
          setIsProfileComplete(data?.response.profileComplete);
          setUser(u); // Setting user triggers the screen swap
        } catch (error) {
          console.log("Backend check failed", error);
          setUser(null); 
        }
      } else {
        setUser(null);
        setIsProfileComplete(null);
      }
      setInitializing(false); // Hide the loading spinner
    });

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) return <ActivityIndicator size={'large'} />;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>

        {!user ? (
          // UNAUTHENTICATED ROUTES
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </>
        ) : 
          // AUTHENTICATED ROUTES
          isProfileComplete === false ? (
            <>
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
            </>
          ) : (
            <>
              <Stack.Screen name="HomeScreen" component={HomeScreen}/>
              <Stack.Screen name="MessagesScreen" component={MessagesScreen}/>
              <Stack.Screen name="LikeScreen" component={LikeScreen}/>
              <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
              <Stack.Screen name="OthersProfileScreen" component={OthersProfileScreen}/>
              <Stack.Screen name="MessageScreen2" component={MessageScreen2}/>
              <Stack.Screen name="SettingScreen" component={SettingScreen}/>
              <Stack.Screen name="EditProfile" component={EditProfile}/>
              <Stack.Screen name="EditImage" component={EditImage}/>
              <Stack.Screen name="NotificationScreen" component={NotificationScreen}/>
              <Stack.Screen name="BlockListScreen" component={BlockListScreen}/>
            </>
          )
        }
      </Stack.Navigator>
      
    </NavigationContainer>
  )
}




export default App