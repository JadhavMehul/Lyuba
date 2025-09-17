import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import React, { useState } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import { goBack, resetAndNavigate } from "@utils/NavigationUtils";
import { navigate } from "@utils/NavigationUtils";
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

const RegisterScreen8 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, "params">>();
    const { userData } = route.params;

    const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (index: number, uri: string | null) => {
        const updated = [...photos];
        updated[index] = uri;
        setPhotos(updated);
    };

    const nextScreen = async () => {
        const hasPhoto = photos.some((p) => p !== null);
        if (!hasPhoto) {
            Alert.alert("Please upload at least one photo");
            return;
        }
        try {
            setLoading(true);

            const api = "http://192.168.117.133:3000/api/auth/register";
            const formData = new FormData();

            // append userData text fields
            Object.entries(userData).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    // nested object -> flatten (e.g. personalData)
                    Object.entries(value).forEach(([k, v]) => {
                        formData.append(`${key}[${k}]`, v ?? "");
                    });
                } else {
                    formData.append(key, value ?? "");
                }
            });

            // append photos
            photos.forEach((uri, idx) => {
                if (uri) {
                    formData.append("pictures", {
                        uri,
                        type: "image/jpeg",
                        name: `photo_${idx}.jpg`,
                    } as any);
                }
            });

            const res = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const data = await res.json();
            console.log("Register response:", data);

            if (data.success) {
                resetAndNavigate("HomeScreen");
            } else {
                Alert.alert("Error", data.message || "Something went wrong");
            }
        } catch (error) {
            console.log("Upload error:", error);
            Alert.alert("Error", `${error}`);
        } finally {
            setLoading(false);
        }
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

                        <View style={{ height: 16 }} />

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
                </View>

                <View style={styles.buttonsection}>
                    <PinkButton
                        // text="Next"
                        text={loading ? "Uploading..." : "Next"}
                        onPress={nextScreen}
                        style={styles.shadowpink}
                    />
                </View>
            </CustomSafeAreaView>
        </View>
    );
};

export default RegisterScreen8;

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
    title2: {
        fontFamily: Fonts.Poppins_Light_300,
        fontSize: 16,
        color: "#666666",
        textAlign: "left",
    },
    title1: {
        fontFamily: Fonts.Poppins_Bold_700,
        fontSize: 28,
        color: "#000000",
        textAlign: "left",
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
        gap: 24,
        width: "100%",
        justifyContent: "center",
    },
});
