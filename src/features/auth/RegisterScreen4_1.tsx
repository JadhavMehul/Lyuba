import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';
import { RouteProp, useRoute } from '@react-navigation/native';



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
  provider: string;
};


const RegisterScreen4_1 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    const [city, setCity] = useState(userData.city);
    const [pincode, setPincode] = useState(userData.pincode || "");

    const nextScreen = () => {
        navigate("RegisterScreen5", {userData: {...userData, city, pincode}});
    }    
    

    return (
        <View style={styles.container}>
            <CustomSafeAreaView>
                <View style={{ flex: 1,backgroundColor: "#fff", }}>

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
                        <View style={{ height: 16 }}>

                        </View>
                        <TextComponent style={styles.title1}>
                            Fetching Location
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Please wait while we fetch your current location.
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>
                       
                        <TextComponent style={styles.inputtitle}>
                            City
                        </TextComponent>
                        <InputField
                            placeholder="City"
                            value={city}
                            onChangeText={setCity}
                        />
                        <View style={{ height: 20 }}>

                        </View>
                        <TextComponent style={styles.inputtitle}>
                            Pincode
                        </TextComponent>
                        <InputField
                            placeholder="Pincode"
                            value={pincode}
                            onChangeText={setPincode}
                        />


                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={nextScreen}
                        style={[
                            styles.shadowpink,
                        ]}
                        disabled={!city || !pincode}
                    />

                </View>
            </CustomSafeAreaView>


        </View>
    )
}

export default RegisterScreen4_1







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