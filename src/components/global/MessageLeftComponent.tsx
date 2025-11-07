import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';
import ReadMoreText from './ReadMoreText';
const { width } = Dimensions.get('window');

type Props = {
    message: string;
    time: string;
};

export default function MessageLeftComponent({ message, time }: Props) {
    return (
        <View style={styles.leftmessage}>
            <View style={styles.actualmessage}>

                <ReadMoreText
                    text={message}
                    numberOfChars={100}
                    textStyle={styles.messages}
                    readMoreTextStyle={{ color: '#FF7F7F' }}
                />
            </View>
            <TextComponent style={styles.time}>{time}</TextComponent>
        </View>
    );
}

const styles = StyleSheet.create({

    leftmessage: {
        alignItems: 'flex-start',

        // backgroundColor: 'red'
    },
    actualmessage: {
        width: width * 0.76,
        backgroundColor: '#FDF2F3',
        paddingHorizontal: 24,
        paddingVertical: 28,
        borderRadius: 15,
        borderBottomLeftRadius: 0,
    },
    messages: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
    time: {
        fontFamily: Fonts.Poppins_Regular_400,
        fontSize: 12,
        color: '#999999',
        marginTop: 10,
    },
});
