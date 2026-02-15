import { Image, StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from "react";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import Icon from "react-native-vector-icons/FontAwesome";
import ReadMoreText from '@components/global/ReadMoreText';
import { RouteProp, useRoute } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get("window");
const INTERESTS = [
    { id: "1", label: "Movie", icon: "film" },
    { id: "2", label: "Cycling", icon: "bicycle" },
    { id: "3", label: "Cooking", icon: "cutlery" },
    { id: "4", label: "Swimming", icon: "life-ring" },
    { id: "5", label: "Coding", icon: "code" },
    { id: "6", label: "Gaming", icon: "gamepad" },
    { id: "7", label: "Yoga", icon: "heartbeat" },
    { id: "8", label: "Dinner Dates", icon: "glass" },
    { id: "9", label: "Gambling", icon: "money" },
    { id: "10", label: "Poker", icon: "spade" },
    { id: "11", label: "Crypto", icon: "bitcoin" },
    { id: "12", label: "Stock Market", icon: "line-chart" },
    { id: "13", label: "Football", icon: "futbol-o" },
    { id: "14", label: "Cricket", icon: "trophy" },
    { id: "15", label: "Tennis", icon: "circle-o" },
    { id: "16", label: "Travelling", icon: "plane" },
];


type Person = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string;
  gender: string;
  birthdate: string;
  city: string;
  pincode: string;
  pictures: string[];
  interests: string[];
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  personalData: {
    profession: string;
    feet: string;
    inch: string;
    education: string;
    religion: string;
    sign: string;
    workingAt: string;
    status: string;
    drinking: string;
    smoking: string;
    workout: string;
    looking: string;
    kids: string;
    genderPreference: string;
  };
}

export default function OthersProfileScreen() {
    const route = useRoute<RouteProp<{ params: { userData: Person } }, 'params'>>();
    const { userData } = route.params;
    
    const userDetails = auth().currentUser;
    console.log(userDetails);
    

    // const [userData, setUserData] = useState<UserData>()
    
    return (
        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView>
                    <View>
                        <View style={styles.imagecont}>

                            <Image
                                source={{ uri: userData?.pictures[0] }}
                                style={styles.image}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.bottomprofile}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <TextComponent style={styles.title1}>
                                        {
                                            userData?.firstName && userData?.lastName ? (
                                                `${userData.firstName} ${userData.lastName}`
                                            ) : (
                                                userData?.firstName
                                            ) ? (
                                                userData.firstName
                                            ) : (
                                                ""
                                            )
                                        }
                                    </TextComponent>
                                    
                                    {
                                        userData?.personalData.profession && 
                                        <TextComponent style={styles.title2}>
                                            {userData?.personalData.profession}
                                        </TextComponent>
                                    }

                                </View>
                                <TouchableOpacity onPress={() => navigate("MessageScreen2", {myId: userDetails?.uid, otherUserId: userData.id})}>
                                    <Image
                                        source={require("@assets/icons/message.png")}
                                        style={styles.image2}
                                    />

                                </TouchableOpacity>


                            </View>
                            <View style={styles.line}>

                            </View>
                            <View>
                                <TextComponent style={styles.title1}>
                                    About
                                </TextComponent>
                                <ReadMoreText
                                text={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry "}
                                numberOfChars={100}
                                textStyle={styles.title3}
                                readMoreTextStyle={{ color: '#FF7F7F' }}
                              />
                                {/* <TextComponent style={styles.title3}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry te ...Read More
                                </TextComponent> */}
                            </View>
                            <View style={styles.line}>

                            </View>
                            <View>
                                <TextComponent style={styles.title1}>
                                    Location
                                </TextComponent>
                                <TextComponent style={styles.title3}>
                                    {userData?.city}.
                                </TextComponent>
                            </View>
                            <View style={styles.line}>

                            </View>
                            <View>
                                <TextComponent style={styles.title1}>
                                    Interset
                                </TextComponent>
                                <View style={styles.container2}>
                                    {
                                        userData && (
                                            userData.interests.map((interestLabel, index) => {
                                            const interestItem = INTERESTS.find(i => i.label === interestLabel);

                                            return (
                                                <View
                                                key={index}
                                                style={[styles.chip]}
                                                >
                                                {interestItem?.icon && (
                                                    <Icon
                                                    name={interestItem.icon}
                                                    size={18}
                                                    color={"#000"}
                                                    style={{ marginRight: 6 }}
                                                    />
                                                )}
                                                <TextComponent style={[styles.text]}>
                                                    {interestLabel}
                                                </TextComponent>
                                                </View>
                                            );
                                            })
                                        )
                                    }
                                </View>
                            </View>
                            <View style={styles.line}>

                            </View>
                            <View>
                                <TextComponent style={styles.title1}>
                                    Gallery
                                </TextComponent>
                                <View>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false} 

                                    >
                                        {
                                            userData?.pictures.map((item, index) => {
                                                return (
                                                    <View key={index} style={styles.imagecontainer}>
                                                        <Image
                                                            source={{ uri: item }}
                                                            style={styles.image}
                                                            resizeMode='cover'
                                                        />
                                                    </View>
                                                )
                                            })
                                        }
                                        {/* <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View> */}
                                    </ScrollView>
                                </View>

                            </View>
                        </View>







                    </View>

                </ScrollView>


            </View>
            <BottomNav />

        </CustomSafeAreaView>
    )
}


const styles = StyleSheet.create({


    image: {
        width: "100%",
        height: "100%",
    },

    imagecont: {
        width: "100%",
        height: screenWidth * 0.93,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        // backgroundColor: 'red',
        overflow: 'hidden',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    image2: {
        width: 30,
        height: 30,
    },
    bottomprofile: {
        padding: 24,
        gap: 16,
    },
    title3: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#333333',
        textAlign: 'left',

    },
    title2: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 16,
        color: '#666666',
        textAlign: 'left',
    },
    title1: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
    },
    line: {
        height: 1,
        backgroundColor: '#FFC0CB',
        width: '100%',
    },
    container2: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFC0CB",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 5,
    },
    chipSelected: {
        backgroundColor: "#FFE3E8",
        borderColor: "#FFC0CB",
    },
    text: {
        fontSize: 18,
        color: "#000",
        fontFamily: Fonts.Poppins_Medium_500,
    },
    textSelected: {
        color: "#FF6F61",
    },
    imagecontainer: {
        zIndex: 1,
        width: 100,
        height: 129,
        backgroundColor: "#ffe6eb",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
        overflow: "hidden",

    },


})