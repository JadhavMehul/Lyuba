import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack, navigate } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import LocationAnimation from '@components/auth_components/LocationAnimation';
import Geolocation from 'react-native-geolocation-service';


const RegisterScreen4 = () => {

    async function requestLocationPermission(): Promise<boolean> {
        if (Platform.OS !== 'android') return true;
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to get city and pincode.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn('Permission error', err);
            return false;
        }
    }

    const getPosition = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.warn('Location permission not granted');
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                console.log('Coords:', position.coords);
            },
            (error) => {
                console.log('Error:', error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    useEffect(() => {
        getPosition();
    }, []);


    return (
        <View style={styles.container}>
            <CustomSafeAreaView>
                <View style={{ flex: 1 }}>
                    <View style={styles.inner_container}>
                        {/* Back button */}
                        <View style={styles.backcon}>
                            <TouchableOpacity onPress={goBack}>
                                <Image
                                    source={require("@assets/icons/back.png")}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 16 }} />

                        {/* Title & Subtitle */}
                        <TextComponent style={styles.title1}>
                            Fetching Location
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Please wait while we fetch your current location.
                        </TextComponent>

                        {/* <View style={{ height: 32 }} /> */}
                        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <LocationAnimation />
                        </View>

                    </View>
                </View>



                {/* Bottom Button */}
                <View style={styles.buttonsection}>
                    <PinkButton
                        text="Next"
                        onPress={() => navigate('RegisterScreen4_1')}
                        style={[styles.shadowpink]}
                    />
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

export default RegisterScreen4;

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


});
