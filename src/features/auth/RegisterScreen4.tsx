import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack, navigate } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import LocationAnimation from '@components/auth_components/LocationAnimation';
import Geolocation from 'react-native-geolocation-service';
import GetLocation from 'react-native-get-location'
import { RouteProp, useRoute } from '@react-navigation/native';
import { API_IP } from '@env';

type UserData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string | null;
  photoURL: string | null;
  birthdate: string;
  gender: string;
  provider: string;
};

const RegisterScreen4 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;
    

    const [locationPermission, setLocationPermission] = useState(false)
   

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
            console.log('Permission error', err);
            return false;
        }
    }

    const getPosition = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.warn("Location permission not granted");
            setLocationPermission(false);
            return;
        } 
        
        setLocationPermission(true);

        try {

            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            })
                .then(async location => {
                    const { latitude, longitude } = location;

                    try {
<<<<<<< HEAD
                        // const api = "http://10.0.2.2:3000/api/location/getLocation";
                        // console.log(API_IP);

                        let api_ip = API_IP;
                        const api = `${api_ip}:3000/api/location/getLocation`;
=======
                        const api = "http://10.0.2.2:3000/api/location/getLocation";
                        // const api = "http://192.168.0.109:3000/api/location/getLocation";
>>>>>>> 8fc6dd9 (homescreen animation done)

                        const res = await fetch(api, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ latitude, longitude }),
                        });
                        const data = await res.json();
                        
                        const city = data?.response?.city;
                        const pincode = data?.response?.pincode || null;

                        console.log(city, pincode);
                        console.log(data);
                        
                        

                        navigate("RegisterScreen4_1", {userData: {...userData, city, pincode}});

                    } catch (error) {
                        console.log("error in getting location:", error);
                        
                    }

                })
                .catch(error => {
                    const { code, message } = error;
                    console.log(code, message);
                })

        } catch (error) {
            console.log("Location fetch error:", error);
        }
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
                            {
                                locationPermission ? (
                                    <TextComponent style={styles.title2}>
                                        Please wait while we fetch your current location.
                                    </TextComponent>
                                ) : (
                                    <TextComponent style={styles.title2}>
                                        Unable to fetch location please turn on location permission.
                                    </TextComponent>
                                )
                            }
                            

                        {/* <View style={{ height: 32 }} /> */}
                        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            {
                                locationPermission ? (
                                    <LocationAnimation />
                                ) : (
                                    <Image
                                        source={require("@assets/icons/noloc.png")}
                                        style={styles.pin}
                                        resizeMode="contain"
                                    />
                                )
                            }
                        </View>

                    </View>
                </View>



                {/* Bottom Button */}
                {/* <View style={styles.buttonsection}>
                    <PinkButton
                        text="Next"
                        onPress={() => navigate('RegisterScreen4_1')}
                        style={[styles.shadowpink]}
                    />
                </View> */}
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


});
