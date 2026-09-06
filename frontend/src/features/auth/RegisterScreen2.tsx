import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from "react";
import PinkButton from '@components/global/PinkButton'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import BirthdayPicker from '@components/global/BirthdayPicker';
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import { RouteProp, useRoute } from '@react-navigation/native';


type UserData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string | null;
  photoURL: string | null;
  provider: string;
};


const RegisterScreen2 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    const [birthday, setBirthday] = useState<Date | null>(null);


    function pad2(n: number) {
        return n < 10 ? `0${n}` : String(n);
    }

    const nextScreen = () => {
        let birthdate = ""
        if (birthday) {
            birthdate = (`${pad2(birthday.getDate())}/${pad2(birthday.getMonth() + 1)}/${birthday.getFullYear()}`);
        }
        navigate("RegisterScreen3", {userData: {...userData, birthdate}});
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
                        <ScrollView style={{ width: '100%'}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <View style={{ height: 16 }}>

                        </View>
                        <TextComponent style={styles.title1}>
                            Enter Your Details
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Please enter your birthdate.
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>
                        <TextComponent style={styles.inputtitle}>
                            Date of Birth 
                            <TextComponent style={{ color: "red" }}> *</TextComponent>
                        </TextComponent>
                        <BirthdayPicker

                            value={birthday}
                            onChange={setBirthday}
                            themeColor="#FF7F7F"
                        // minimumYear={1900}
                        // maximumYear={2025}
                        // placeholder="dd/mm/yyyy"
                        />
                    </ScrollView>

                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={nextScreen}
                        disabled={!birthday}
                        style={[
                            styles.shadowpink,
                        ]}
                    />

                </View>
            </CustomSafeAreaView>


        </View>
    )
}

export default RegisterScreen2







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