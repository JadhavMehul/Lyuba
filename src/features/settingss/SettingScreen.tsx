import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { goBack, navigate, resetAndNavigate } from "@utils/NavigationUtils";
import ShinyCard from '@components/global/GlassCard'
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin'



const SettingScreen = () => {


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
                            Settings
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

                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Edit.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Edit Profile</TextComponent>
                                </View>

                            </TouchableOpacity>



                            {/* <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Account_Info.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Account info</TextComponent>
                                </View>


                            </TouchableOpacity> */}
                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Privacy.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Privacy</TextComponent>
                                </View>


                            </TouchableOpacity>
                            {/* <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Security.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Security</TextComponent>
                                </View>


                            </TouchableOpacity> */}

                            












                        </ShinyCard>

                        <ShinyCard>
                            <View style={styles.apart}>
                                <TextComponent style={styles.title}>Content</TextComponent>
                                <Image
                                    source={require('../../assets/icons/Content.png')}   // your gif path
                                    style={styles.icon}
                                />


                            </View>

                            <View style={styles.divider} />
                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Notification.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Notification</TextComponent>
                                </View>


                            </TouchableOpacity>



                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Block.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Block</TextComponent>
                                </View>


                            </TouchableOpacity>
                        </ShinyCard>


                        <ShinyCard>
                            <View style={styles.apart}>
                                <TextComponent style={styles.title}>Application</TextComponent>
                                <Image
                                    source={require('../../assets/icons/Application.png')}   // your gif path
                                    style={styles.icon}
                                />


                            </View>

                            <View style={styles.divider} />

                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Theme.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Theme</TextComponent>
                                </View>


                            </TouchableOpacity>
                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/About.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>About</TextComponent>
                                </View>


                            </TouchableOpacity>
                            <TouchableOpacity>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/help.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Help</TextComponent>
                                </View>


                            </TouchableOpacity>
                            <TouchableOpacity onPress={logout}>


                                <View style={styles.together}>
                                    <Image
                                        source={require('../../assets/icons/Logout.png')}   // your gif path
                                        style={styles.icon}
                                    />

                                    <TextComponent style={styles.item}>Logout</TextComponent>
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
    },

    item: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 0,
        lineHeight: 20,
    },

    divider: {
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
    together: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 8,
        // backgroundColor: "green",
    }
})

export default SettingScreen
