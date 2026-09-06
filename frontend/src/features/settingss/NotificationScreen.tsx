import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { goBack } from "@utils/NavigationUtils";
import CustomToggle from '@components/global/CustomToggle'
import { checkNotifications, openSettings, requestNotifications } from 'react-native-permissions'

const NotificationScreen = () => {
    // There's no push-notification backend wired up yet, so this reflects and
    // requests the device's actual notification permission (there's nothing
    // else to toggle) — it's not a fake switch.
    const [enabled, setEnabled] = useState(false);

    const refreshStatus = useCallback(async () => {
        try {
            const { status } = await checkNotifications();
            setEnabled(status === 'granted');
        } catch (error) {
            console.log('checkNotifications error:', error);
        }
    }, []);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    const handleToggle = async (next: boolean) => {
        if (!next) {
            // iOS/Android don't let an app revoke its own notification
            // permission — the only real way to turn it off is Settings.
            Alert.alert(
                'Turn off notifications',
                'To turn off notifications for Lyuba, disable them in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => openSettings().catch(() => {}) },
                ],
            );
            return;
        }

        try {
            const { status } = await requestNotifications(['alert', 'sound', 'badge']);

            if (status === 'granted') {
                setEnabled(true);
            } else if (status === 'blocked') {
                Alert.alert(
                    'Notifications disabled',
                    'Notifications are turned off in your device settings. Open settings to enable them?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => openSettings().catch(() => {}) },
                    ],
                );
            }
        } catch (error) {
            console.log('requestNotifications error:', error);
        }
    };

    return (
        <CustomSafeAreaView style={{}}>


            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.topmessagebar}>


                    <View style={styles.backcon}>
                        <TouchableOpacity onPress={goBack}>
                            <Image
                                source={require("@assets/icons/back.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />

                        </TouchableOpacity>
                        <TextComponent style={styles.title1}>
                            Notifications
                        </TextComponent>


                    </View>

                </View>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>

                    <View style={styles.apart}>
                        <TextComponent style={styles.title}>Enable Notifications</TextComponent>
                        <CustomToggle value={enabled} onValueChange={handleToggle} />


                    </View>
                </View>
            </View>

        </CustomSafeAreaView>
    )
}


const styles = StyleSheet.create({
    line: {
        height: 1,
        backgroundColor: '#FFC0CB',
        width: '100%',
    },
    title1: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 24,
        color: '#000000',
        textAlign: 'left',
        lineHeight: 30,
    },
    backcon: {
        // paddingVertical: 8,
        flexDirection: 'row',
        gap: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',

    },
    image: {
        width: 24,
        height: 24,

    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
    title: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 20,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 0,
        lineHeight: 24,
    },

    item: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 0,
        lineHeight: 20,
    },

    divider: {
        height: 1,
        backgroundColor: "#FF7F7F",
        marginVertical: 10,
    },
    icon: {
        // backgroundColor: "red",
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    apart: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        alignItems: "center",
    },
    together: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 8,
        // backgroundColor: "green",
    }
})

export default NotificationScreen
