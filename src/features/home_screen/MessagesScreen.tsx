import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';

export default function MessagesScreen() {

   
    return (


        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Text>
                    message screen
                </Text>

                
            </View>
            <BottomNav />

            {/* <BottomNav/> */}
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({})