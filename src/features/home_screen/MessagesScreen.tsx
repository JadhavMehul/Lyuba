import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import InputField from '@components/global/InputField';
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import MessageCard from '@components/global/MessageCard';
import { formatTime } from '@utils/ChatHelper';

type ChatType = {
    name: string,
    lastMessage: string,
    profileImage: string,
    updatedAt: {
        _seconds: number;
        _nanoseconds: number;
    },
    unreadCount: number,
    otherUserId: string

}

export default function MessagesScreen() {

    const [chats, setChats] = useState< ChatType[] >([]);

    const userDetails = auth().currentUser;

    console.log(userDetails?.uid);
    

    // 🔹 Fetch chats from backend
    const fetchChats = async () => {
        try {
        const api = `${ENV.API_IP}:3000/api/message/getChats`
        
        const res = await fetch(api, {
            method: "POST", // you said you always send JSON
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userDetails?.uid,
            }),
        });

        const data = await res.json();
        setChats(data);
        } catch (err) {
            console.log("fetchChats error:", err);
        }
    };

    // 🔹 Load chats on screen open
    useEffect(() => {
        fetchChats();
    }, []);

    return (


        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
                <InputField
                    placeholder="Enter name to search"
                    style={styles.forsearch}
                    placeholderTextColor="#FF7F7F"
                />
                <ScrollView>
                    <View style={{ flex: 1, gap: 20, paddingTop: 20 }}>
                        

                        {
                            chats.map((chat, index) => (
                                <MessageCard
                                    key={index}
                                    image={chat.profileImage}
                                    name={chat.name}
                                    message={chat.lastMessage}
                                    time={formatTime(chat.updatedAt)}
                                    messageCount={chat.unreadCount}
                                    onPress={() => navigate("MessageScreen2", {myId: userDetails?.uid, otherUserId: chat.otherUserId})}
                                />
                            ))
                        }




                        



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