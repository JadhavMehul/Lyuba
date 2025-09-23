import { Image, StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from "react";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { navigate } from '@utils/NavigationUtils';
import PinkButton from '@components/global/PinkButton';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import Icon from "react-native-vector-icons/FontAwesome";
import ReadMoreText from '@components/global/ReadMoreText';

const { width: screenWidth } = Dimensions.get("window");
const INTERESTS = [
    { id: "1", label: "Movie", icon: "film" },
    { id: "2", label: "Cycling", icon: "bicycle" },
    { id: "3", label: "Cooking", icon: "cutlery" },
    { id: "4", label: "Swimming", icon: "life-ring" },
    { id: "5", label: "Coding", icon: "code" },


];



export default function ProfileScreen() {

   
    return (


        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView>
                    <View>
                        <View style={styles.imagecont}>

                            <Image
                                source={require("@assets/images/person.png")}
                                style={styles.image}
                                resizeMode='cover'
                            />
                        </View>
                        <View style={styles.bottomprofile}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <TextComponent style={styles.title1}>
                                        Sai Tamankar
                                    </TextComponent>
                                    <TextComponent style={styles.title2}>
                                        UI/UX Designer
                                    </TextComponent>

                                </View>
                                <TouchableOpacity>
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
                                    Sai Tamankar
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
                                    Mumbai, Maharashtra, India
                                </TextComponent>
                            </View>
                            <View style={styles.line}>

                            </View>
                            <View>
                                <TextComponent style={styles.title1}>
                                    Interset
                                </TextComponent>
                                <View style={styles.container2}>
                                    {INTERESTS.map((item) => {


                                        return (
                                            <View
                                                key={item.id}
                                                style={[styles.chip]}
                                            >
                                                <Icon
                                                    name={item.icon}
                                                    size={18}
                                                    color={"#000"}
                                                    style={{ marginRight: 6 }}
                                                />
                                                <TextComponent style={[styles.text]}>
                                                    {item.label}
                                                </TextComponent>
                                            </View>
                                        );
                                    })}
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
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
                                        <View style={styles.imagecontainer}></View>
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