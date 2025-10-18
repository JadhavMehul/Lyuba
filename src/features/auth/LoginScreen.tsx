import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect } from 'react'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import AuthButton from '@components/auth_components/AuthButton'
import { navigate } from '@utils/NavigationUtils';
import auth, { FacebookAuthProvider, getAuth, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { API_IP } from '@env';

const { width: screenWidth } = Dimensions.get("window");

const LoginScreen = () => {

  useEffect(() => {
    // Optional: check Google Play services
    GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch(() => {
      // Device may not have Play Services; handle gracefully
    });
  }, []);

  // const signInWithGoogle = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //     const signInResult = (await GoogleSignin.signIn()) as {
  //       data?: { idToken?: string; accessToken?: string };
  //     };

  //     // v13+ returns tokens inside signInResult.data
  //     const idToken = signInResult.data?.idToken;
  //     const accessToken = signInResult.data?.accessToken ?? undefined;

  //     if (!idToken) {
  //       Alert.alert('Google Sign-In failed', 'No ID token received.');
  //       return;
  //     }

  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);
  //     const userCredential = await auth().signInWithCredential(googleCredential);
  //     const firebaseUser = userCredential.user;

  //     // Check if email exists with other providers
  //     const methods = await auth().fetchSignInMethodsForEmail(firebaseUser.email!);
  //     if (methods.length > 0 && !methods.includes("google.com")) {
  //       return Alert.alert(
  //         "Account exists",
  //         `This email is already registered with ${methods.join(", ")}. Please login with that provider.`
  //       );
  //     }

  //     // Get Firebase ID token
  //     const firebaseIdToken = await firebaseUser.getIdToken();

  //     console.log("idToken: ", firebaseIdToken);

  //     // Send to backend 
  //     // const api = "http://10.0.2.2:3000/api/auth/social";
  //     const api = "http://192.168.0.109:3000/api/auth/social";
  //     const res = await fetch(api, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ idToken: firebaseIdToken }),
  //     });
  //     const data = await res.json();
  //     console.log(data);
      

  //     if (data.response.profileComplete === false) {
  //       Alert.alert("Welcome!", "New user registered");
  //       navigate("RegisterScreen1", {userData: data.response.user}); // New user → register flow
  //     } else if (data.response.profileComplete === true) {
  //       Alert.alert("Welcome back!", "Login successful");
  //       if (data.response.profileComplete === true) {
  //         navigate("HomeScreen"); // Existing user → main app
  //       } else {
  //         navigate("RegisterScreen1"); // Existing user but data incomplete → register flow
  //       }
  //     } else {
  //       Alert.alert("Auth error", data?.error ?? "Unknown error");
  //     }
  //   } catch (e: any) {
  //     Alert.alert('Google Sign-In error', e?.message ?? String(e));
  //   }
  // };
  const handleFirebaseUser = async (user: any) => {
    try {
      const firebaseIdToken = await user.getIdToken();
      console.log("Firebase ID Token:", firebaseIdToken);

      let api_ip = API_IP;
      const api = `${api_ip}:3000/api/auth/social`; // Update to your backend
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: firebaseIdToken }),
      });
      const data = await res.json();

      if (data.response.profileComplete === false) {
        Alert.alert("Welcome!", "New user registered");
        navigate("RegisterScreen1", { userData: data.response.user });
      } else {
        Alert.alert("Welcome back!", "Login successful");
        navigate("HomeScreen");
      }
    } catch (error) {
      console.log("Backend error:", error);
      Alert.alert("Error", "Failed to communicate with backend");
    }
  };

  const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = (await GoogleSignin.signIn()) as {
      data?: { idToken?: string; accessToken?: string; user?: { email: string;}};
    };
    

    const idToken = signInResult.data?.idToken;
    const accessToken = signInResult.data?.accessToken;
    const email = signInResult.data?.user?.email;

    if (!idToken || !email) return Alert.alert("Google Sign-In failed", "No ID token received.");

    
    // Decode token to get email
    // const email = googleUser.user.email;

    // Check if email exists with other providers
    console.log(idToken);
    console.log(email);
    
    const methods = await auth().fetchSignInMethodsForEmail(email);
    console.log(methods);
    
    if (methods.length > 0 && !methods.includes("google.com")) {
      return Alert.alert(
        "Account exists",
        `This email is already registered with ${methods.join(", ")}, Please login with that  ${methods.join(", ")}.`
      );
    }

    const googleUser = await auth().signInWithCredential(auth.GoogleAuthProvider.credential(idToken, accessToken));


    // Proceed with sign-in
    const firebaseIdToken = await googleUser.user.getIdToken();
    console.log(firebaseIdToken);
    
    handleFirebaseUser(googleUser.user);

  } catch (e: any) {
    Alert.alert("Google Sign-In error", e?.message ?? "Unknown error");
  }
};

const signInWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
    if (result.isCancelled) return;

    const data = await AccessToken.getCurrentAccessToken();
    if (!data?.accessToken) return Alert.alert("Facebook Sign-In failed", "No access token received.");

    // Fetch email from Facebook Graph API
    const fbResponse = await fetch(`https://graph.facebook.com/me?access_token=${data.accessToken}&fields=email`);
    const fbData = await fbResponse.json();
    const email = fbData.email;

    if (!email) return Alert.alert("Facebook Sign-In failed", "Unable to retrieve email from Facebook.");

    // Check if email exists with other providers
    const methods = await auth().fetchSignInMethodsForEmail(email);
    if (methods.length > 0 && !methods.includes("facebook.com")) {
      return Alert.alert(
        "Account exists",
        `This email is already registered with ${methods.join(", ")}. Please login with that provider.`
      );
    }

    // Proceed to sign in
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    const userCredential = await auth().signInWithCredential(facebookCredential);
    console.log(userCredential.user.getIdToken());
    
    handleFirebaseUser(userCredential.user);

  } catch (e: any) {
    Alert.alert("Facebook Sign-In error", e?.message ?? "Unknown error");
  }
};



//   const signInWithFacebook = async () => {
//   try {
//     const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
//     if (result.isCancelled) return;

//     const data = await AccessToken.getCurrentAccessToken();
//     if (!data?.accessToken) {
//       Alert.alert("Facebook Sign-In failed", "No access token received.");
//       return;
//     }

//     const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

//     let userCredential;
//     try {
//       userCredential = await auth().signInWithCredential(facebookCredential);
//     } catch (rawError: any) {
//       const code = rawError?.code ?? "unknown";
//       const message = rawError?.message ?? "Unknown error";
//       const email = rawError?.customData?.email;
//       const pendingCredential = rawError?.credential;

//       if (code === "auth/account-exists-with-different-credential" && email) {
//         const methods = await auth().fetchSignInMethodsForEmail(email);

//         if (methods.includes("google.com")) {
//           Alert.alert(
//             "Account exists",
//             "This email is already registered with Google. Please sign in with Google to link Facebook."
//           );
//         } else {
//           Alert.alert("Account exists", "This email is registered with another provider.");
//         }
//       } else {
//         console.log("Facebook sign-in error:", rawError);
//         Alert.alert(`Facebook Sign-In error [${code}]`, message);
//       }
//       return;
//     }

//     const firebaseUser = userCredential.user;
//     const firebaseIdToken = await firebaseUser.getIdToken();

//     console.log("Firebase ID Token:", firebaseIdToken);

//     const api = "http://192.168.117.133:3000/api/auth/social";
//     const res = await fetch(api, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ idToken: firebaseIdToken }),
//     });
//     const dataFromBackend = await res.json();

//     if (dataFromBackend.response.profileComplete === false) {
//       Alert.alert("Welcome!", "New user registered");
//       navigate("RegisterScreen1", { userData: dataFromBackend.response.user });
//     } else if (dataFromBackend.response.profileComplete === true) {
//       Alert.alert("Welcome back!", "Login successful");
//       navigate("HomeScreen");
//     } else {
//       Alert.alert("Auth error", dataFromBackend?.error ?? "Unknown error");
//     }
//   } catch (e: any) {
//     const message = e?.message ?? "Unknown error";
//     console.log("Facebook Sign-In catch error:", e);
//     Alert.alert("Facebook Sign-In error", message);
//   }
// };






  const logout = async () => {
    try {
        // 1️⃣ Sign out from Firebase
        await auth().signOut();

        // 2️⃣ Sign out from Google if still connected
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
            await GoogleSignin.signOut();
        }

        console.log("User logged out successfully");

        // 3️⃣ (Optional) Navigate back to Login screen
        navigate("LoginScreen");

    } catch (error) {
        console.error("Logout error: ", error);
    }
  };

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
                onPress={signInWithGoogle}
              />

              <AuthButton
                text="Facebook"
                icon={require("@assets/icons/facebook.png")}
                onPress={signInWithFacebook}
              />
              <AuthButton
                text="Facebook"
                icon={require("@assets/icons/facebook.png")}
                onPress={logout}
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

export default LoginScreen;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
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