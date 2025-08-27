import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';

const RegisterScreen4_1 = () => {
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
                        />
                        <View style={{ height: 20 }}>

                        </View>
                        <TextComponent style={styles.inputtitle}>
                            Pincode
                        </TextComponent>
                        <InputField
                            placeholder="Pincode"
                        />


                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={() => navigate('RegisterScreen4_2')}
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