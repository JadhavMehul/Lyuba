import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { goBack, resetAndNavigate } from "@utils/NavigationUtils";
import ShinyCard from '@components/global/GlassCard'


const SettingScreen = () => {
    return (
        <CustomSafeAreaView style={{  }}>


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
                            Settings
                        </TextComponent>


                    </View>

                </View>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ShinyCard>
                            <Text style={styles.title}>Account</Text>

                            <View style={styles.divider} />
                            {/* <Image
    source={require('../../assets/icons/home_pink.png')}   // your gif path
    style={styles.icon}
  /> */}
                            <Text style={styles.item}>Edit Profile</Text>
                            <Text style={styles.item}>Account Info</Text>
                            <Text style={styles.item}>Security</Text>
                            <Text style={styles.item}>Privacy</Text>
                        </ShinyCard>


                    </ScrollView>

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
        color: "#000000",
        fontSize: 18,
        marginBottom: 10
    },

    item: {
        color: "#000000",
        fontSize: 16,
        marginVertical: 5
    },

    divider: {
        height: 1,
        backgroundColor: "#FF7F7F",
        marginVertical: 5,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8,
      },
})

export default SettingScreen
