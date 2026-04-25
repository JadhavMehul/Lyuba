import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import { navigate } from '@utils/NavigationUtils';
import { goBack, resetAndNavigate } from "@utils/NavigationUtils";
import InputField from '@components/global/InputField'
import DropdownField from '@components/global/DropdownField'




const EditProfile = () => {

    const [selectedValue, setSelectedValue] = useState<string | undefined>();
    const [working, setWorking] = useState("");
    const [profession, setProfession] = useState("");


    const nextScreen = () => {
        if (!selectedValue) {
            Alert.alert("Please enter details");
            return;
        }

        navigate("RegisterScreen8", {
            // userData: {
            //     ...userData, personalData: {
            //         ...userData.personalData,
            //         workingAt: working,
            //         profession: profession,
            //         education: selectedValue
            //     },
            // }
        });
    }
    const [personalData, setPersonalData] = useState({
        feet: "",
        inch: "",
        looking: "",
        smoking: "",
        drinking: "",
        workout: "",
        religion: "",
        sign: "",
        status: "",
        kids: "",
        genderPreference: "",
    });

    const updatePersonalData = (field: string, value: string) => {
        setPersonalData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TextComponent style={styles.inputtitle}>
                            First Name
                        </TextComponent>
                        <InputField
                            placeholder="Enter your first name"
                        // value={firstName}
                        // onChangeText={setFirstName}
                        />
                        <View style={{ height: 20 }}>

                        </View>
                        <TextComponent style={styles.inputtitle}>
                            Last Name
                        </TextComponent>
                        <InputField
                            placeholder="Enter your Last name"
                        // value={lastName}
                        // onChangeText={setLastName}
                        />
 <View style={{ height: 20 }}>

</View>

<TextComponent style={styles.inputtitle}>
                                Height
                            </TextComponent>
                            <View style={styles.rowcon}>
                                <View style={{ width: "48%" }}>
                                    <DropdownField
                                        options={["4 Feet", "5 Feet", "6 Feet", "7 Feet"]}
                                        placeholder="Feet"
                                        value={personalData.feet}
                                        onSelect={(val) => updatePersonalData("feet", val)}
                                    />
                                </View>
                                <View style={{ width: "48%" }}>
                                    <DropdownField
                                        options={[
                                            "0 Inch", "1 Inch", "2 Inch", "3 Inch", "4 Inch",
                                            "5 Inch", "6 Inch", "7 Inch", "8 Inch", "9 Inch",
                                            "10 Inch", "11 Inch",
                                        ]}
                                        placeholder="Inch"
                                        value={personalData.inch}
                                        onSelect={(val) => updatePersonalData("inch", val)}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 20 }} />
                            <TextComponent style={styles.inputtitle}>
                                Looking For
                            </TextComponent>
                            <DropdownField
                                options={[
                                    "Serious relationship",
                                    "Casual relationship",
                                    "Figuring out",
                                    "Dont want to say",
                                ]}
                                placeholder="Looking for"
                                value={personalData.looking}
                                onSelect={(val) => updatePersonalData("looking", val)}
                            />

                            <View style={{ height: 20 }} />
                            <View style={styles.rowcon}>
                                <View style={{ width: "48%" }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Smoking
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes", "No", "Sometimes", "Dont want to say"]}
                                        placeholder="Smoking"
                                        value={personalData.smoking}
                                        onSelect={(val) => updatePersonalData("smoking", val)}
                                    />
                                </View>
                                <View style={{ width: "48%" }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Drinking
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes", "No", "Sometimes", "Dont want to say"]}
                                        placeholder="Drinking"
                                        value={personalData.drinking}
                                        onSelect={(val) => updatePersonalData("drinking", val)}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 20 }} />
                            <TextComponent style={styles.inputtitle}>
                                Workout
                            </TextComponent>
                            <DropdownField
                                options={["Active", "Inactive", "Sometimes"]}
                                placeholder="Workout"
                                value={personalData.workout}
                                onSelect={(val) => updatePersonalData("workout", val)}
                            />

                            <View style={{ height: 20 }} />
                            <TextComponent style={styles.inputtitle}>
                                Religion
                                <TextComponent style={{ color: "red" }}> *</TextComponent>
                            </TextComponent>
                            <DropdownField
                                options={[
                                    "Christianity", "Islam", "Hinduism", "Buddhism", "Sikhism",
                                    "Judaism", "Jainism", "Baha'i Faith", "Confucianism", "Taoism",
                                    "Shinto", "Chinese Folk Religion", "Animism/Adivasi", "No Religion",
                                ]}
                                placeholder="Religion"
                                value={personalData.religion}
                                onSelect={(val) => updatePersonalData("religion", val)}
                            />

                            <View style={{ height: 20 }} />
                            <TextComponent style={styles.inputtitle}>
                                Sun sign
                            </TextComponent>
                            <DropdownField
                                options={[
                                    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
                                    "Libra", "Scorpio", "Sagittarius", "Capricorn",
                                    "Aquarius", "Pisces",
                                ]}
                                placeholder="Sun sign"
                                value={personalData.sign}
                                onSelect={(val) => updatePersonalData("sign", val)}
                            />

                            <View style={{ height: 20 }} />
                            <View style={styles.rowcon}>
                                <View style={{ width: "48%" }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Marital Status
                                    </TextComponent>
                                    <DropdownField
                                        options={["Married", "Unmarried", "Dont want to say"]}
                                        placeholder="Marital Status"
                                        value={personalData.status}
                                        onSelect={(val) => updatePersonalData("status", val)}
                                    />
                                </View>
                                <View style={{ width: "48%" }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Kids
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes", "No", "Want", "Don't want", "Dont want to say"]}
                                        placeholder="Kids"
                                        value={personalData.kids}
                                        onSelect={(val) => updatePersonalData("kids", val)}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 20 }} />
                            <TextComponent style={styles.inputtitle}>
                                Gender Preference
                                <TextComponent style={{ color: "red" }}> *</TextComponent>
                            </TextComponent>
                            <DropdownField
                                options={["male", "female", "both"]}
                                placeholder="Gender preference"
                                value={personalData.genderPreference}
                                onSelect={(val) => updatePersonalData("genderPreference", val)}
                            />

<View style={{ height: 16 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Working
                            </TextComponent>
                            <InputField
                                placeholder="TCS / Wipro"
                                // value={working}
                                // onChangeText={setWorking}
                            />
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Profession
                            </TextComponent>
                            <InputField
                                placeholder="Profession"
                                // value={profession}
                                // onChangeText={setProfession}
                            />
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Education
                            </TextComponent>
                            <DropdownField
                                options={[
                                    "No formal education",
                                    "Primary School",
                                    "Middle School",
                                    "High School / Secondary",
                                    "Higher Secondary (HSC)",
                                    "Diploma / Polytechnic",
                                    "Undergraduate (Bachelor's Degree)",
                                    "Graduate (Post Graduation / Master's Degree)",
                                    "Doctorate (PhD)",
                                    "Post Doctorate",
                                    "Professional Certification (CA, CS, CFA, etc.)",
                                    "Vocational Training",
                                    "Other",
                                ]}
                                placeholder="Select your education"
                                value={selectedValue}
                                onSelect={(val) => setSelectedValue(val)}
                            />

                        
                    </ScrollView>
                </View>

            </View>
        </CustomSafeAreaView>
    )
}
const styles = StyleSheet.create({
    topmessagebar: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: '#666666',
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
    inputtitle: {
        fontFamily: Fonts.Poppins_Medium_500,
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
    },

    rowcon: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
})
export default EditProfile