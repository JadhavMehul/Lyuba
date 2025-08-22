import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import AuthButton from '@components/AuthButton'
import { navigate } from '@utils/NavigationUtils';

const { width: screenWidth } = Dimensions.get("window");

const loginScreen = () => {
  return (
    <View style={styles.container}>
      <CustomSafeAreaView>
        <View style={{ flex: 1,backgroundColor: "#fff" }}>

          <View style={styles.inner_container}>
            <Image
              source={require("@assets/images/logo.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.belowcon}>
              <TextComponent style={styles.headtitle}>
                Sign Up to Continue
              </TextComponent>
              <TextComponent style={styles.paratitle}>
                Please login to continue
              </TextComponent>
              

            </View>

            <View style={styles.morebelowcon}>
              <AuthButton
                text="Google"
                icon={require("@assets/icons/google.png")}
                onPress={() => navigate('registerScreen1')}
              />

              <AuthButton
                text="Facebook"
                icon={require("@assets/icons/facebook.png")}
                onPress={() => navigate('registerScreen1')}
              />

            </View>

          </View>
          <View style={{ paddingHorizontal: 24 }}>
            <TouchableOpacity>
              <TextComponent style={styles.termstext}>
                I accept all{" "} {"\n"}
                <TextComponent style={styles.termstext2}>
                  Terms & Conditions{" "}
                </TextComponent>
                and{" "}
                <TextComponent style={styles.termstext2}>
                  Privacy Policy
                </TextComponent>
              </TextComponent>
            </TouchableOpacity>


          </View>


        </View>
      </CustomSafeAreaView>


    </View>
  )
}

export default loginScreen


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    backgroundColor: "yellow",
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
  },
  inner_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
    paddingHorizontal: 24,
  },

  belowcon: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    marginTop: 16,
  },
  headtitle: {
    fontFamily: Fonts.Poppins_Bold_700,
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
  },
  paratitle: {
    fontFamily: Fonts.Poppins_Light_300,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  morebelowcon: {
    paddingVertical: 24,
    gap: 24,
    width: '100%',
  },
  termstext: {
    fontFamily: Fonts.Poppins_Regular_400,
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
  },
  termstext2: {
    fontFamily: Fonts.Poppins_Regular_400,
    fontSize: 17,
    color: '#FF6F61',
    textAlign: 'center',
  }
})