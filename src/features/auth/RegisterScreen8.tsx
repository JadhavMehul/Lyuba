import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import PhotoBody from '@components/global/PhotoBody';
import { RouteProp, useRoute } from '@react-navigation/native';

type PersonalData = {
    feet: string | null;
    inch: string | null;
    looking: string | null;
    smoking: string | null;
    drinking: string | null;
    workout: string | null;
    religion: string;
    sign: string | null;
    status: string | null;
    kids: string | null;
    genderPreference: string;
    workingAt: string | null;
    profession: string | null;
    education: string | null;
};

type UserData = {
    uid: string;
    email: string;
    firstName: string;
    lastName: string | null;
    photoURL: string | null;
    birthdate: string;
    gender: string;
    city: string;
    pincode: string | null;
    interests: string[];
    personalData: PersonalData;
    provider: string;
};

const RegisterScreen8 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    console.log(userData);

    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);

    const handleImageChange = (index: number, uri: string | null) => {
        const updated = [...photos];
        updated[index] = uri;
        setPhotos(updated);
    };


    return (
        <View style={styles.container}>
            <CustomSafeAreaView>
                <View style={{ flex: 1 }}>

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
                            Upload Pictures
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Please upload your pictures
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>

                        <View style={styles.uploadphotosection}>
                            {photos.map((uri, idx) => (
                                <PhotoBody
                                    key={idx}
                                    imageUri={uri || undefined}
                                    onChange={(newUri) => handleImageChange(idx, newUri)}
                                />
                            ))}
                            {/* <PhotoBody initialState={true} onToggle={(isAdd) => console.log("Now:", isAdd)} />
                            <PhotoBody initialState={false} onToggle={(isAdd) => console.log("Now:", isAdd)} />
                            <PhotoBody initialState={true} onToggle={(isAdd) => console.log("Now:", isAdd)} />
                            <PhotoBody initialState={false} onToggle={(isAdd) => console.log("Now:", isAdd)} />
                            <PhotoBody initialState={true} onToggle={(isAdd) => console.log("Now:", isAdd)} />
                            <PhotoBody initialState={false} onToggle={(isAdd) => console.log("Now:", isAdd)} /> */}
                        </View>




                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={() => navigate('InterestsScreen')}
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

export default RegisterScreen8







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
    image: {
        width: 24,
        height: 24,

    },

    uploadphotosection: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 24,
        width: '100%',
        // backgroundColor: 'red',
        justifyContent: 'center',
    }


})