import { View, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomSafeAreaView from "@components/global/CustomSafeAreaView";
import { goBack } from "@utils/NavigationUtils";
import TextComponent from "@components/global/TextComponent";
import PinkButton from "@components/global/PinkButton";
import { Fonts } from "@utils/Constants";
import PhotoBody from "@components/global/PhotoBody";
import { apiFetch } from "@utils/api";
import auth from "@react-native-firebase/auth";

const SLOT_COUNT = 6;

/**
 * A slot is either empty, a photo the server already stores (remote), or a
 * freshly picked image still living on the device (local).
 */
type Slot =
    | null
    | { kind: "remote"; url: string }
    | { kind: "local"; uri: string };

const emptySlots = (): Slot[] => Array(SLOT_COUNT).fill(null);

const EditImage = () => {
    const [photos, setPhotos] = useState<Slot[]>(emptySlots());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // What the server had when this screen loaded, so we can tell whether
    // anything actually changed before firing a request.
    const originalUrls = useRef<string[]>([]);

    const applyPictures = (pictures: string[]) => {
        const slots = emptySlots();
        pictures.slice(0, SLOT_COUNT).forEach((url, idx) => {
            slots[idx] = { kind: "remote", url };
        });
        setPhotos(slots);
        originalUrls.current = pictures.slice(0, SLOT_COUNT);
    };

    const loadExistingPhotos = async () => {
        try {
            const userId = auth().currentUser?.uid;
            if (!userId) {
                Alert.alert("Sign in required", "Sign in again to edit your photos.");
                return;
            }

            // The server takes the uid from the verified token; userId is sent
            // only so this screen still works against the older endpoint.
            const res = await apiFetch("/api/userDetails/profile", {
                method: "POST",
                body: { userId },
            });
            const data = await res.json();

            if (data.foundData) {
                applyPictures(data.response.user.pictures || []);
            } else {
                console.log("Profile load returned:", data);
            }
        } catch (error: any) {
            console.log("Error loading photos:", error?.message || error);
            Alert.alert("Couldn't load photos", "Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExistingPhotos();
    }, []);

    const handleImageChange = (index: number, uri: string | null) => {
        setPhotos(prev => {
            const updated = [...prev];
            updated[index] = uri ? { kind: "local", uri } : null;
            return updated;
        });
    };

    /** The gallery as the user sees it, gaps removed. */
    const visiblePhotos = () => photos.filter(Boolean) as Exclude<Slot, null>[];

    const hasChanges = () => {
        const current = visiblePhotos();
        if (current.some(s => s.kind === "local")) return true;

        const currentUrls = current.map(s => (s as { url: string }).url);
        if (currentUrls.length !== originalUrls.current.length) return true;
        return currentUrls.some((url, i) => url !== originalUrls.current[i]);
    };

    const saveChanges = async () => {
        const current = visiblePhotos();

        if (current.length === 0) {
            Alert.alert("Add at least one photo", "Your profile needs a photo to be shown to others.");
            return;
        }

        if (!hasChanges()) {
            goBack();
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();

            // An ordered manifest of what the gallery should look like after
            // this save. "keep" points at a photo the server already has;
            // "upload" points at a file in this same request, by fieldname.
            const manifest = current.map((slot, idx) =>
                slot.kind === "remote"
                    ? { type: "keep", url: slot.url }
                    : { type: "upload", field: `photo_${idx}` }
            );

            formData.append("slots", JSON.stringify(manifest));

            current.forEach((slot, idx) => {
                if (slot.kind === "local") {
                    formData.append(`photo_${idx}`, {
                        uri: slot.uri,
                        type: "image/jpeg",
                        name: `photo_${idx}.jpg`,
                    } as any);
                }
            });

            const res = await apiFetch("/api/userDetails/updatePictures", {
                method: "PUT",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                // Re-sync from the server's answer so screen and backend
                // can't drift apart.
                applyPictures(data.pictures || []);
                Alert.alert("Photos updated", undefined, [
                    { text: "OK", onPress: () => goBack() },
                ]);
            } else {
                Alert.alert("Couldn't save photos", data.error || "Please try again.");
            }
        } catch (error: any) {
            console.log("Error saving photos:", error?.message || error);
            Alert.alert("Couldn't save photos", "Check your connection and try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <CustomSafeAreaView style={{}}>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={styles.topmessagebar}>
                    <View style={styles.backcon}>
                        <TouchableOpacity onPress={goBack} disabled={saving}>
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
                        Tap a photo to replace it, or remove one you don't want.
                    </TextComponent>

                    <View style={{ height: 16 }} />

                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <View style={styles.uploadphotosection}>
                            {photos.map((slot, idx) => (
                                <PhotoBody
                                    key={idx}
                                    imageUri={
                                        slot?.kind === "remote"
                                            ? slot.url
                                            : slot?.kind === "local"
                                                ? slot.uri
                                                : undefined
                                    }
                                    onChange={(newUri: string | null) => handleImageChange(idx, newUri)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.buttonsection}>
                    <PinkButton
                        text={saving ? "Saving..." : "Save changes"}
                        onPress={saving ? () => { } : saveChanges}
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