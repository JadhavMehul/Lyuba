import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import DropdownField from '@components/global/DropdownField';

const registerScreen6 = () => {
    const [selectedFeet, setSelectedFeet] = useState<string | undefined>();
    const [selectedInch, setSelectedInch] = useState<string | undefined>();
    const [selectedLooking, setSelectedLooking] = useState<string | undefined>();
    const [selectedSmoking, setSelectedSmoking] = useState<string | undefined>();
    const [selectedDrinking, setSelectedDrinking] = useState<string | undefined>();
    const [selectedWorkout, setSelectedWorkout] = useState<string | undefined>();
    const [selectedReligion, setSelectedReligion] = useState<string | undefined>();
    const [selectedSign, setSelectedSign] = useState<string | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
    const [selectedKids, setSelectedKids] = useState<string | undefined>();
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
                        <ScrollView style={{ width: '100%'}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>


                            <View style={{ height: 16 }}>

                            </View>
                            <TextComponent style={styles.title1}>
                                Enter Your Details
                            </TextComponent>
                            <TextComponent style={styles.title2}>
                                Please enter your personal details.
                            </TextComponent>
                            <View style={{ height: 16 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Height
                            </TextComponent>
                            <View style={styles.rowcon}>
                                <View style={{ width: '48%' }}>
                                    <DropdownField
                                        options={["4 Feet", "5 Feet", "6 Feet", "7 Feet"]}
                                        placeholder="Feet"
                                        value={selectedFeet}
                                        onSelect={(val) => setSelectedFeet(val)}
                                    />
                                </View>
                                <View style={{ width: '48%' }}>
                                    <DropdownField
                                        options={["0 Inch", "1 Inch", "2 Inch", "3 Inch", "4 Inch", "5 Inch", "6 Inch", "7 Inch", "8 Inch", "9 Inch", "10 Inch", "11 Inch"]}
                                        placeholder="Inch"
                                        value={selectedInch}
                                        onSelect={(val) => setSelectedInch(val)}
                                    />
                                </View>

                            </View>
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Looking For
                            </TextComponent>
                            <DropdownField
                                options={["Serious relationship", "Casual relationship", "Figuring out","Dont want to say"]}
                                placeholder="Looking for"
                                value={selectedLooking}
                                onSelect={(val) => setSelectedLooking(val)}
                            />
                            <View style={{ height: 20 }}>

                            </View>

                            <View style={styles.rowcon}>
                                <View style={{ width: '48%' }}>

                                    <TextComponent style={styles.inputtitle}>
                                        Smoking
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes ", "No", "Sometimes","Dont want to say"]}
                                        placeholder="Smoking"
                                        value={selectedSmoking}
                                        onSelect={(val) => setSelectedSmoking(val)}
                                    />
                                </View>
                                <View style={{ width: '48%' }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Drinking
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes ", "No", "Sometimes","Dont want to say"]}
                                        placeholder="Drinking"
                                        value={selectedDrinking}
                                        onSelect={(val) => setSelectedDrinking(val)}
                                    />
                                </View>

                            </View>
                            <View style={{ height: 20 }}>

                            </View>
                            <TextComponent style={styles.inputtitle}>
                                Workout
                            </TextComponent>
                            <DropdownField
                                options={["Active", "Inactive", "Sometimes"]}
                                placeholder="Workout"
                                value={selectedWorkout}
                                onSelect={(val) => setSelectedWorkout(val)}
                            />
                            <View style={{ height: 20 }}>

</View>
<TextComponent style={styles.inputtitle}>
    Religion
</TextComponent>
<DropdownField
    options={["Christianity", "Islam", "Hinduism", "Buddhism", "Sikhism", "Judaism", "Jainism", "Baha'i Faith", "Confucianism", "Taoism", "Shinto", "Chinese Folk Religion", "Animism/Adivasi", "No Religion"
]}
    placeholder="Religion"
    value={selectedReligion}
    onSelect={(val) => setSelectedReligion(val)}
/>

                        <View style={{ height: 20 }}>

</View>
<TextComponent style={styles.inputtitle}>
    Sun sign
</TextComponent>
<DropdownField
    options={["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]}
    placeholder="Sun sign"
    value={selectedSign}
    onSelect={(val) => setSelectedSign(val)}
/>    
<View style={{ height: 20 }}>

                            </View>

                            <View style={styles.rowcon}>
                                <View style={{ width: '48%' }}>

                                    <TextComponent style={styles.inputtitle}>
                                        Martial Status
                                    </TextComponent>
                                    <DropdownField
                                        options={["Married ", "Unmarried", "Dont want to say"]}
                                        placeholder="Martial Status"
                                        value={selectedStatus}
                                        onSelect={(val) => setSelectedStatus(val)}
                                    />
                                </View>
                                <View style={{ width: '48%' }}>
                                    <TextComponent style={styles.inputtitle}>
                                        Kids
                                    </TextComponent>
                                    <DropdownField
                                        options={["Yes ", "No", "Want", "Don't want","Dont want to say"]}
                                        placeholder="Kids"
                                        value={selectedKids}
                                        onSelect={(val) => setSelectedKids(val)}
                                    />
                                </View>

                            </View>

                        </ScrollView>
                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={() => navigate('registerScreen7')}
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

export default registerScreen6







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
    image: {
        width: 24,
        height: 24,

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
    rowcon: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },

})