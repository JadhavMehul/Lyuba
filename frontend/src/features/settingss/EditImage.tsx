import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import { goBack, navigate } from "@utils/NavigationUtils";
import TextComponent from "@components/global/TextComponent";
import PinkButton from "@components/global/PinkButton";
import { Fonts } from "@utils/Constants";
import { apiFetch } from "@utils/api";
import PhotoBody from "@components/global/PhotoBody";
import auth from "@react-native-firebase/auth";

const PHOTO_SLOTS = 6;

/**
 * What updatePictures expects, in final gallery order:
 *   keep   -> a picture already on the profile, sent back by its exact URL
 *   upload -> a new file, matched to the FormData field of the same name
 */
type Slot = { type: "keep"; url: string } | { type: "upload"; field: string };

/** Saved pictures are full Storage URLs; freshly picked ones are file:// / content:// / ph:// */
const isLocalUri = (uri: string): boolean =>
    !uri.startsWith("http://") && !uri.startsWith("https://");

const EditImage = () => {
    const [photos, setPhotos] = useState<(string | null)[]>(
        Array(PHOTO_SLOTS).fill(null)
    );
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const handleImageChange = (index: number, uri: string | null) => {
        const updated = [...photos];
        updated[index] = uri;
        setPhotos(updated);
    };

    // ---------- load existing pictures ----------
    useEffect(() => {
        const loadPictures = async () => {
            try {
                const userId = auth().currentUser?.uid;

                const res = await apiFetch("/api/userDetails/profile", {
                    method: "POST",
                    body: { userId },
                });
                const data = await res.json();
                console.log("Profile response:", data);

                if (!data?.foundData) {
                    Alert.alert("Error", data?.message || "Could not load your profile");
                    return;
                }

                const pictures: string[] = data.response?.user?.pictures ?? [];

                // Stored URLs are kept byte-for-byte: updatePictures matches
                // "keep" slots against them exactly, so don't rewrite them.
                setPhotos(
                    Array.from({ length: PHOTO_SLOTS }, (_, i) => pictures[i] ?? null)
                );
            } catch (error) {
                console.log("Profile fetch error:", error);
                Alert.alert("Error", "Could not load your pictures. Please try again.");
            } finally {
                setFetching(false);
            }
        };

        loadPictures();
    }, []);

    // ---------- save ----------
    const savePictures = async () => {
        // Collapse the fixed 6 slots down to the photos actually set, in the
        // order they're shown — that order is what the gallery is saved as.
        const chosen = photos.filter((uri): uri is string => !!uri);

        if (chosen.length === 0) {
            Alert.alert("Atleast one photo require","Please upload at least one photo");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            const slots: Slot[] = chosen.map((uri, idx) => {
                if (!isLocalUri(uri)) return { type: "keep", url: uri };

                // Freshly picked photo: goes up as a file, and the slot points
                // at it by field name so the server can put it back in place.
                // The stored filename is chosen server-side (photo_0..photo_5),
                // so this name is only how the two halves find each other.
                const field = `photo_${idx}`;
                formData.append(field, {
                    uri,
                    type: "image/jpeg",
                    name: `${field}.jpg`,
                } as any);
                return { type: "upload", field };
            });

            formData.append("slots", JSON.stringify(slots));

            // No explicit Content-Type — fetch has to set multipart/form-data
            // with its own boundary.
            
            const res = await apiFetch("/api/userDetails/updatePictures", {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();
            console.log("Update pictures response:", data);

            if (!res.ok || !data?.success) {
                Alert.alert("Error", data?.message || "Could not save your pictures");
                return;
            }

            // Re-seed from the server so the local uris are replaced by their
            // stored URLs — a second save then sends them as "keep" slots
            // instead of re-uploading the same files.
            const saved: string[] = data.pictures ?? [];
            setPhotos(
                Array.from({ length: PHOTO_SLOTS }, (_, i) => saved[i] ?? null)
            );

            navigate("HomeScreen");
        } catch (error) {
            console.log("Update pictures error:", error);
            Alert.alert("Error", "Could not save your pictures. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomSafeAreaView style={{}}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={styles.topmessagebar}>
                    <View style={styles.backcon}>
                        <TouchableOpacity onPress={goBack}>
                            <Image
                                source={require("@assets/icons/back.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TextComponent style={styles.title1}>Edit Profile</TextComponent>
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
                    <TextComponent style={styles.title1}>Upload Pictures</TextComponent>
                    <TextComponent style={styles.title2}>
                        Please upload your pictures
                    </TextComponent>

                    <View style={{ height: 16 }} />

                    {fetching ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#FF6F61" />
                        </View>
                    ) : (
                        <View style={styles.uploadphotosection}>
                            {photos.map((uri, idx) => (
                                <PhotoBody
                                    key={idx}
                                    imageUri={uri || undefined}
                                    onChange={(newUri) => handleImageChange(idx, newUri)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.buttonsection}>
                    <PinkButton
                        text={loading ? "Saving..." : "Save changes"}
                        onPress={savePictures}
                        disabled={loading || fetching}
                        style={styles.shadowpink}
                    />
                </View>
            </View>
        </CustomSafeAreaView>
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
        flexDirection: "row",
        gap: 0,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-start",
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
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
        borderColor: "#666666",
    },
});