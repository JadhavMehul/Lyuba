import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';
const MessageScreen2 = () => {
    return (
        <View style={styles.container}>


            <CustomSafeAreaView>


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
                                Emelie Clark

                            </TextComponent>


                        </View>

                    </View>
                    <View style={{ flex: 1,padding: 16 }}>

                    </View>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 24, flexDirection: 'row', gap: 10 }}>
                        <InputField
                            placeholder="Message"
                            style={styles.formessage}
                            placeholderTextColor="#000000"
                        />
                        <TouchableOpacity style={styles.sendmessage} activeOpacity={0.6}>
                        <View >
                            <Image
                                source={require("@assets/icons/send.png")}
                                style={styles.image2}
                            />

                        </View>

                        </TouchableOpacity>
                        
                    </View>
                </View>
            </CustomSafeAreaView>
        </View>
    )
}

export default MessageScreen2




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
    image: {
        width: 24,
        height: 24,

    },
    image2: {
        width: 23,
        height: 20,
    },
    backcon: {
        paddingVertical: 8,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },

    title1: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 16,
        color: '#000000',
        textAlign: 'left',
    },
    formessage: {
        flex: 1,
        width: 'auto',
        backgroundColor: '#fff',
        color: '#000',
        shadowColor: "0",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,

    },
    sendmessage: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#FF7F7F',
        borderWidth: 2,
        backgroundColor: '#FFB6C1',
        // padding: 24,
        width: 54,
        borderRadius: 12,
    }
})