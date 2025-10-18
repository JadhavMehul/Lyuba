import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';

export default function HomeScreen() {

    const logout = async () => {
        try {
            // 1️⃣ Sign out from Firebase
            await auth().signOut();

            // 2️⃣ Sign out from Google if still connected
            const currentUser = await GoogleSignin.getCurrentUser();
            if (currentUser) {
                await GoogleSignin.signOut();
            }

            console.log("User logged out successfully");

            // 3️⃣ (Optional) Navigate back to Login screen
            navigate("LoginScreen");

        } catch (error) {
            console.log("Logout error: ", error);
        }
    };
    return (


        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text>
                    HomeScreen
                </Text>

                <PinkButton
                    text="Next"
                    onPress={logout}
                />
            </View>
            <BottomNav />

            {/* <BottomNav/> */}
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({})