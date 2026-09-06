import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { goBack, navigate, resetAndNavigate } from "@utils/NavigationUtils";
import ShinyCard from '@components/global/GlassCard'
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import CustomToggle from '@components/global/CustomToggle'



const AccountInfo = () => {


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
        // navigate("LoginScreen");

    } catch (error) {
        console.error("Logout error: ", error);
    }
  };

    return (
        <CustomSafeAreaView style={{}}>


            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.topmessagebar}>


                    <View style={styles.backcon}>
                        <TouchableOpacity onPress={goBack}>
                            <Image
                                source={require("@assets/icons/back.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />

                        </TouchableOpacity>
                        <TextComponent style={styles.title1}>
                        Account Information
                        </TextComponent>


                    </View>

                </View>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ShinyCard>
                            <View style={styles.apart}>
                                <TextComponent style={styles.title}>Account</TextComponent>
                                <Image
                                    source={require('../../assets/icons/Account.png')}   // your gif path
                                    style={styles.icon}
                                />


                            </View>

                            <View style={styles.divider} />

                            <TouchableOpacity onPress={() => navigate("EditProfile")}>

                                <View style={styles.apart2}>
                                    <TextComponent style={styles.item1}>Account</TextComponent>

                                    <TextComponent style={styles.item2}>Account3 AccountAccountAccount</TextComponent>
                                </View>

                            </TouchableOpacity>
                            <View style={styles.divider1} />
                            <TouchableOpacity onPress={() => navigate("EditProfile")}>

                                <View style={styles.apart2}>
                                    <TextComponent style={styles.item1}>Account</TextComponent>

                                    <TextComponent style={styles.item2}>Account3 AccountAccountAccount</TextComponent>
                                </View>

                            </TouchableOpacity>
                            <View style={styles.divider1} />
                            <TouchableOpacity onPress={() => navigate("EditProfile")}>

                                <View style={styles.apart2}>
                                    <TextComponent style={styles.item1}>Account</TextComponent>

                                    <TextComponent style={styles.item2}>Account3 AccountAccountAccount</TextComponent>
                                </View>

                            </TouchableOpacity>
                           



                          
                            
                         



                        </ShinyCard>

                       
                        


                      

                    </ScrollView>

                </View>
            </View>

        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: '#FFC0CB',
        width: '100%',
    },
    title1: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
        lineHeight: 30,
    },
    backcon: {
        // paddingVertical: 8,
        flexDirection: 'row',
        gap: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',

    },
    image: {
        width: 24,
        height: 24,

    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
    title: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 20,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 0,
        lineHeight: 24,
    },

    item1: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 0,
        lineHeight: 20,
        width: '35%',
    },
    item2: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'right',
        marginBottom: 0,
        lineHeight: 20,
        width: '55%',
        // backgroundColor: 'red',
        // borderRadius: 10,
        // padding: 5,
    },

    divider: {
        height: 2,
        backgroundColor: "#FF7F7F",
        marginVertical: 10,
    },
    divider1: {
        height: 1,
        backgroundColor: "#FF7F7F",
        marginVertical: 10,
    },
    icon: {
        // backgroundColor: "red",
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    apart: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        alignItems: "center",
    },
    apart2: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
        alignItems: "center",
        // marginBottom: 8,
    },
    together: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 8,
        // backgroundColor: "green",
    }
})

export default AccountInfo
