import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';
import DropdownField from '@components/global/DropdownField';
import { RouteProp, useRoute } from '@react-navigation/native';

type PersonalData = {
    feet: string | null;
    inch: string | null;
    looking: string | null;
    smoking: string | null;
    drinking: string | null;
    workout: string | null;
    religion: string;
    sign: string | null;
    status: string | null;
    kids: string | null;
    genderPreference: string;
    workingAt?: string | null;
    profession?: string | null;
    education?: string | null;
};

type UserData = {
    uid: string;
    email: string;
    firstName: string;
    lastName: string | null;
    photoURL: string | null;
    birthdate: string;
    gender: string;
    city: string;
    pincode: string | null;
    interests: string[];
    personalData: PersonalData;
    provider: string;
};

const RegisterScreen7 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    console.log(userData);

    const [selectedValue, setSelectedValue] = useState<string | undefined>();
    const [working, setWorking] = useState("");
    const [profession, setProfession] = useState("");


    const nextScreen = () => {
        if (!selectedValue) {
            Alert.alert("Please enter details");
            return;
        }

        navigate("RegisterScreen8", {
            userData: {
                ...userData, personalData: {
                    ...userData.personalData,
                    workingAt: working,
                    profession: profession,
                    education: selectedValue
                },
            }
        });
    }
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
                                Please enter your educational and professional details.
                            </TextComponent>
                            <View style={{ height: 16 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Working
                            </TextComponent>
                            <InputField
                                placeholder="TCS / Wipro"
                                value={working}
                                onChangeText={setWorking}
                            />
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Profession
                            </TextComponent>
                            <InputField
                                placeholder="Profession"
                                value={profession}
                                onChangeText={setProfession}
                            />
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Education
                            </TextComponent>
                            <DropdownField
                                options={[
                                    "No formal education",
                                    "Primary School",
                                    "Middle School",
                                    "High School / Secondary",
                                    "Higher Secondary (HSC)",
                                    "Diploma / Polytechnic",
                                    "Undergraduate (Bachelor's Degree)",
                                    "Graduate (Post Graduation / Master's Degree)",
                                    "Doctorate (PhD)",
                                    "Post Doctorate",
                                    "Professional Certification (CA, CS, CFA, etc.)",
                                    "Vocational Training",
                                    "Other",
                                ]}
                                placeholder="Select your education"
                                value={selectedValue}
                                onSelect={(val) => setSelectedValue(val)}
                            />


                        </ScrollView>

                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={nextScreen}
                        // disabled={!birthday}
                        style={[
                            styles.shadowpink,
                        ]}
                    />

                </View>
            </CustomSafeAreaView>


        </View>
    )
}

export default RegisterScreen7







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
        backgroundColor: "#fff",
    },
    backcon: {
        paddingVertical: 8,
    },
    image: {
        width: 24,
        height: 24,

    },
    buttonsection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "#fff",
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
    shadowpink: {
        shadowColor: "#FF6F61",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },

})