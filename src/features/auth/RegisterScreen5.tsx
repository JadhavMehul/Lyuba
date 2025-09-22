import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import Icon from "react-native-vector-icons/FontAwesome";
import { RouteProp, useRoute } from '@react-navigation/native';


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
  provider: string;
};

const INTERESTS = [
    { id: "1", label: "Movie", icon: "film" },
    { id: "2", label: "Cycling", icon: "bicycle" },
    { id: "3", label: "Cooking", icon: "cutlery" },
    { id: "4", label: "Swimming", icon: "life-ring" },
    { id: "5", label: "Coding", icon: "code" },
    { id: "6", label: "Gaming", icon: "gamepad" },
    { id: "7", label: "Yoga", icon: "heartbeat" },
    { id: "8", label: "Dinner Dates", icon: "glass" },
    { id: "9", label: "Gambling", icon: "money" },
    { id: "10", label: "Poker", icon: "spade" },
    { id: "11", label: "Crypto", icon: "bitcoin" },
    { id: "12", label: "Stock Market", icon: "line-chart" },
    { id: "13", label: "Football", icon: "futbol-o" },
    { id: "14", label: "Cricket", icon: "trophy" },
    { id: "15", label: "Tennis", icon: "circle-o" },
    { id: "16", label: "Travelling", icon: "plane" },

];

const RegisterScreen5 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string, label: string) => {
        if (selected.includes(label)) {
            setSelected(selected.filter((x) => x !== label));
        } else {
            if (selected.length < 5) {
                setSelected([...selected, label]);
            } else {
                Alert.alert("Limit Reached", "You can select a maximum of 5 interests.");
            }
        }
    };


    const nextScreen = () => {
        navigate("RegisterScreen6", {userData: {...userData, interests: selected}});
    }    
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
                            Select your Interest
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Select at least 3 interests to match with users who have similar things in common.
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>
                        <ScrollView contentContainerStyle={styles.container2}>
                            {INTERESTS.map((item) => {
                                const isSelected = selected.includes(item.label);

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.chip, isSelected && styles.chipSelected]}
                                        onPress={() => toggle(item.id, item.label)}
                                    >
                                        <Icon
                                            name={item.icon}
                                            size={18}
                                            color={isSelected ? "#FF6F61" : "#000"}
                                            style={{ marginRight: 6 }}
                                        />
                                        <TextComponent style={[styles.text, isSelected && styles.textSelected]}>
                                            {item.label}
                                        </TextComponent>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>


                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={nextScreen}
                        disabled={selected.length < 3}
                        style={[
                            styles.shadowpink,
                        ]}
                    />

                </View>
            </CustomSafeAreaView>


        </View>
    )
}

export default RegisterScreen5







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
        backgroundColor: "#fff",
    },
    backcon: {
        paddingVertical: 8,
    },
    image: {
        width: 24,
        height: 24,

    },
    buttonsection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "#fff",
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
    disabledButton: {
        backgroundColor: '#FAB9B9',
    },



    container2: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFC0CB",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 5,
    },
    chipSelected: {
        backgroundColor: "#FFE3E8",
        borderColor: "#FFC0CB",
    },
    text: {
        fontSize: 18,
        color: "#000",
        fontFamily: Fonts.Poppins_Medium_500,
    },
    textSelected: {
        color: "#FF6F61",
    },
})