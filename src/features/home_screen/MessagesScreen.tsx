import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import InputField from '@components/global/InputField';
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import MessageCard from '@components/global/MessageCard';

export default function MessagesScreen() {


    return (


        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
                <InputField
                    placeholder="Enter your first name"
                    style={styles.forsearch}
                    placeholderTextColor="#FF7F7F"
                />
                <ScrollView>
                    <View style={{ flex: 1, gap: 20, paddingTop: 20 }}>
                        






                        <MessageCard
                            image={require("@assets/images/person.png")}
                            name="Sai Tamankar"
                            role="UI/UX Designer"
                            time="23 mins"
                            messageCount={1}
                            onPress={() => console.log("Message tapped")}
                        />

                        <MessageCard
                            image={require("@assets/images/person.png")}
                            name="Aarav Patel"
                            role="Frontend Developer"
                            time="1 hr"
                            messageCount={0} // hides red badge if 0
                        />







                    </View>
                </ScrollView>

            </View>
            <BottomNav />

            {/* <BottomNav/> */}
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({
    forsearch: {
        backgroundColor: '#FFE3E8',
        color: '#FF7F7F',
    },
    personmessage: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    timing: {
        fontFamily: Fonts.Poppins_Bold_700, fontSize: 12, color: '#ADAFBB'
    },
    numberofmessage: {
        fontFamily: Fonts.Poppins_Bold_700, fontSize: 12, color: '#FFFFFF'
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FF7F7F",
    },
    circleprofile: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: '#FF7F7F',
        overflow: 'hidden'
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    title2: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
    title1: {
        fontFamily: Fonts.Poppins_Bold_700,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
})