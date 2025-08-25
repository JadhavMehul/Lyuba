import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack, navigate } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';

const { width } = Dimensions.get("window");
const circleSizes = [width * 0.4, width * 0.6, width * 0.8]; // responsive sizes

const FetchingLocationAnimation = () => {
    const vals = useRef(circleSizes.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        let cancelled = false;

        const stepMs = 300;   // delay between circles turning pink
        const paintMs = 400;  // duration grey -> pink
        const firstDelay = 1000; // wait before first circle turns pink

        const start = () => {
            const toPink = Animated.stagger(
                stepMs,
                vals.map(v =>
                    Animated.timing(v, {
                        toValue: 1,
                        duration: paintMs,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: false,
                    })
                )
            );

            Animated.sequence([
                Animated.delay(firstDelay),
                toPink,
                Animated.delay(400),
            ]).start(({ finished }) => {
                if (finished && !cancelled) {
                    vals.forEach(v => v.setValue(0)); // reset instantly
                    start(); // loop again
                }
            });
        };

        start();
        return () => {
            cancelled = true;
            vals.forEach(v => v.stopAnimation());
        };
    }, [vals]);

    return (
        <View style={styles.animationContainer}>
            {circleSizes.map((size, i) => {
                const borderColor = vals[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#B3B3B3", "#FF7A86"], // grey -> pink
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.circle,
                            {
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                borderColor,
                            },
                        ]}
                    />
                );
            })}
            {/* <View style={styles.pin} /> */}
            <Image
                source={require("@assets/icons/loc.png")}
                style={styles.pin}
                resizeMode="contain"
            />
        </View>
    );
};

const registerScreen4 = () => {
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
                        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center',  width: '100%' }}>
                             {/* 🔥 Animation here */}
                        <FetchingLocationAnimation />
                        </View>
                       
                    </View>
                </View>

                

                {/* Bottom Button */}
                <View style={styles.buttonsection}>
                    <PinkButton
                        text="Next"
                        onPress={() => navigate('registerScreen4_1')}
                        style={[styles.shadowpink]}
                    />
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

export default registerScreen4;

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

    // Animation styles
    animationContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        // marginTop: -100,
    },
    circle: {
        position: "absolute",
        borderWidth: 8,
    },
    pin: {
        width: 53,
        height: 67,
        // borderRadius: 7,
        // backgroundColor: "#FF7A86",
    },
});
