import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import InputField from '@components/global/InputField';
import MessageLeftComponent from '@components/global/MessageLeftComponent';
import MessageRightComponent from '@components/global/MessageRightComponent';

const { width } = Dimensions.get('window');
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
                    <View style={{ flex: 1, padding: 16 }}>
                        <View style={styles.wrapper}>
                            <View style={styles.line} />
                            <Text style={styles.text}>Today</Text>
                            <View style={styles.line} />
                        </View>

                        <MessageLeftComponent
                            message="Hi Jake, how are you? I saw on the app that we’ve crossed paths several times this week 😄"
                            time="2:55 PM"
                        />


                        <MessageRightComponent
                            message="Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?Hey! Yes, I’ve noticed that too 😄 How’s your week been?"
                            time="2:57 PM"
                        />






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
    },

    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    text: {
        marginHorizontal: 10,
        color: '#444',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
})