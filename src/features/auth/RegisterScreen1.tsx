import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import InputField from '@components/global/InputField'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import { goBack } from "@utils/NavigationUtils";
import PinkButton from '@components/global/PinkButton'
import { navigate } from '@utils/NavigationUtils';
import BirthdayPicker from '@components/global/BirthdayPicker';
import DropdownField from '@components/global/DropdownField';
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";


const RegisterScreen1 = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const isDisabled = firstName.trim().length === 0;

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
            console.error("Logout error: ", error);
        }
    };


    return (
        <View style={styles.container}>
            <CustomSafeAreaView>
                <View style={{ flex: 1 }}>

                    <View style={styles.inner_container}>
                        <View style={styles.backcon}>
                            <TouchableOpacity onPress={goBack}>
                                <Image
                                    source={require("@assets/icons/back.png")}
                                    style={styles.image}
                                    resizeMode="contain"
                                />

                            </TouchableOpacity>


                        </View>
                        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>


                            <View style={{ height: 16 }}>

                            </View>

                            <TextComponent style={styles.title1}>
                                Enter Your Details
                            </TextComponent>
                            <TextComponent style={styles.title2}>
                                Please enter your first and last name.
                            </TextComponent>
                            <View style={{ height: 16 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                First Name
                            </TextComponent>
                            <InputField
                                placeholder="Enter your first name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Last Name
                            </TextComponent>
                            <InputField
                                placeholder="Enter your Last name"
                                value={lastName}
                                onChangeText={setLastName}
                            />












                        </ScrollView>
                    </View>
                </View>
                <View style={styles.buttonsection}>
                    <PinkButton
                        text="Next"
                        onPress={logout}
                        style={[
                            styles.shadowpink,

                        ]}
                        disabled={isDisabled}
                    />
                </View>
            </CustomSafeAreaView>


        </View>
    )
}

export default RegisterScreen1


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner_container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    inputtitle: {
        fontFamily: Fonts.Poppins_Medium_500,
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
    },
    title2: {
        fontFamily: Fonts.Poppins_Light_300,
        fontSize: 16,
        color: '#666666',
        textAlign: 'left',
    },
    title1: {
        fontFamily: Fonts.Poppins_Bold_700,
        fontSize: 28,
        color: '#000000',
        textAlign: 'left',
    },
    image: {
        width: 24,
        height: 24,

    },
    backcon: {
        paddingVertical: 8,
    },

    buttonsection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    shadowpink: {
        shadowColor: "#FF6F61",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    box: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderColor: '#FFC0CB',
        flexDirection: 'row',
        gap: 12,
    },
    fullpink: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFE3E8',
        borderColor: '#FFC0CB',
    },
    blacktext: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_Medium_500,
        color: '#000000',
    },
    pinktext: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_Medium_500,
        color: '#FF6F61',
    },

})