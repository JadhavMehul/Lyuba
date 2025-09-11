import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import { goBack } from "@utils/NavigationUtils";
import { navigate } from '@utils/NavigationUtils';
import TextComponent from '@components/global/TextComponent';
import PinkButton from '@components/global/PinkButton';
import { Fonts } from '@utils/Constants';
import SelectableOption from '@components/global/SelectableOption';
import { RouteProp, useRoute } from '@react-navigation/native';

type UserData = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string | null;
  photoURL: string | null;
  birthdate: string;
  provider: string;
};

const RegisterScreen3 = () => {
    const route = useRoute<RouteProp<{ params: { userData: UserData } }, 'params'>>();
    const { userData } = route.params;

    const [selectedOption, setSelectedOption] = useState<string>("");

    const nextScreen = () => {
        let gender = selectedOption;
        navigate("RegisterScreen4", {userData: {...userData, gender}});
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
                            Enter Your Details
                        </TextComponent>
                        <TextComponent style={styles.title2}>
                            Please select your gender.
                        </TextComponent>
                        <View style={{ height: 16 }}>

                        </View>

                        <View style={styles.containerfirst}>
                            <SelectableOption
                                label="Male"
                                value="male"
                                selectedOption={selectedOption}
                                onPress={setSelectedOption}
                                defaultIcon={require("@assets/icons/maleb.png")}
                                selectedIcon={require("@assets/icons/malepink.png")}
                            />

                            <SelectableOption
                                label="Female"
                                value="female"
                                selectedOption={selectedOption}
                                onPress={setSelectedOption}
                                defaultIcon={require("@assets/icons/femaleblack.png")}
                                selectedIcon={require("@assets/icons/femaleb.png")}
                            />
                            <SelectableOption
                                label="Others"
                                value="others"
                                selectedOption={selectedOption}
                                onPress={setSelectedOption}
                                defaultIcon={require("@assets/icons/othersblack.png")}
                                selectedIcon={require("@assets/icons/otherspink.png")}
                            />
                        </View>



                    </View>
                </View>
                <View style={styles.buttonsection}>

                    <PinkButton
                        text="Next"
                        onPress={nextScreen}
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

export default RegisterScreen3;







const styles = StyleSheet.create({

    maincontent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containername: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
    },
    gendertext: {
        fontSize: 28,
        fontWeight: '700',
    },
    containerfirst: {
        justifyContent: 'center',
        gap: 16,
        flexWrap: 'wrap',
        flexDirection: 'row',

        marginHorizontal: 24,
        marginBottom: 16,
    },
    option: {
        minWidth: 140,
        height: 150,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFB6C1',
        alignItems: 'center',
        justifyContent: 'center',

    },
    selectedOption: {
        borderColor: '#FFB6C1',
        backgroundColor: '#FFE3E8',
        shadowColor: "#FF7F7F",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Medium_500,
    },
    selectedText: {
        color: '#FF7F7F',
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 24,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: 'white',
    },

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
    image2: {
        width: 100,
        height: 100,
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

})