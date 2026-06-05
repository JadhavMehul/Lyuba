import { View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import React, { useState } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import { goBack, resetAndNavigate } from "@utils/NavigationUtils";
import TextComponent from "@components/global/TextComponent";
import PinkButton from "@components/global/PinkButton";
import { Fonts } from "@utils/Constants";
import PhotoBody from "@components/global/PhotoBody";
import { RouteProp, useRoute } from "@react-navigation/native";

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

const EditImage = () => {
    // const route = useRoute<RouteProp<{ params: { userData: UserData } }, "params">>();
    // const { userData } = route.params;

    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (index: number, uri: string | null) => {
        const updated = [...photos];
        updated[index] = uri;
        setPhotos(updated);
    };

    // const nextScreen = () => {
    //     const hasPhoto = photos.some((p) => p !== null);

    //     if (!hasPhoto) {
    //         Alert.alert("Please upload at least one photo");
    //         return;
    //     }

    //     setLoading(true);

    //     // simulate loading (optional)
    //     setTimeout(() => {
    //         setLoading(false);

    //         console.log("User Data:", userData);
    //         console.log("Photos:", photos);

    //         // navigate forward
    //         resetAndNavigate("HomeScreen");
    //     }, 1000);
    // };

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
                            Edit Profile
                        </TextComponent>


                    </View>

                </View>

                <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>

                    <TextComponent style={styles.title1}>Upload Pictures</TextComponent>
                    <TextComponent style={styles.title2}>
                        Please upload your pictures
                    </TextComponent>

                    <View style={{ height: 16 }} />

                    <View style={styles.uploadphotosection}>
                        {photos.map((uri, idx) => (
                            <PhotoBody
                                key={idx}
                                imageUri={uri || undefined}
                                onChange={(newUri) => handleImageChange(idx, newUri)}
                            />
                        ))}
                    </View>
                </View>
                <View style={styles.buttonsection}>
                    <PinkButton
                        text={loading ? "Loading..." : "Next"}
                        onPress={() => { }}
                        style={styles.shadowpink}
                    />
                </View>
            </View>


        </CustomSafeAreaView >
    );
};

export default EditImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner_container: {
        flex: 1,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: "#fff",
    },
    backcon: {
        // paddingVertical: 8,
        flexDirection: 'row',
        gap: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonsection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    title2: {
        fontFamily: Fonts.Poppins_Light_300,
        fontSize: 16,
        color: "#666666",
    },
    title1: {
        fontFamily: Fonts.Poppins_SemiBold_600,
        fontSize: 24,
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
        flexWrap: "wrap",
        flexDirection: "row",
        rowGap: 16,
        columnGap: 20,
        width: "100%",
        justifyContent: "center",
    },
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
    },
});