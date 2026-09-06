import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'

export default function LocationAnimation() {

    const { width } = Dimensions.get("window");
    const circleSizes = [width * 0.4, width * 0.6, width * 0.8]; // responsive sizes


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

const styles = StyleSheet.create({
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
})