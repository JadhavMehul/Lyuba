import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';

const RegisterScreen4_2 = () => {
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
                            Unable to fetch location please turn on location permission.
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>
                        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center',  width: '100%' }}>
                            <Image
                                source={require("@assets/icons/noloc.png")}
                                style={styles.pin}
                                resizeMode="contain"
                            />
                        </View>



                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={() => navigate('RegisterScreen5')}
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

export default RegisterScreen4_2







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
    pin: {
        width: 80,
        height: 80,
    },

})