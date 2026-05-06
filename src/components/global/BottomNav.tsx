import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { useRoute } from "@react-navigation/native";
import { navigate } from "../../utils/NavigationUtils";


const BottomNav: React.FC = () => {
    const route = useRoute();
    const routeName = route.name;

    return (
        <View style={styles.mainbottom_div}>
            <View style={styles.bottomcontainer}>
                <View style={styles.menuItem}>
                    <TouchableHighlight
                        onPress={() => navigate("HomeScreen")}
                        activeOpacity={0.6}
                        underlayColor="none"
                    >
                        <Image
                            source={
                                routeName === "HomeScreen"
                                    ? require("../../assets/icons/home_pink.png")
                                    : require("../../assets/icons/home_black.png")
                            }
                            style={
                                routeName === "HomeScreen"
                                    ? styles.menuItemIcon2
                                    : styles.menuItemIcon
                            }
                        />
                    </TouchableHighlight>
                </View>

                <View style={styles.menuItem}>
                    <TouchableHighlight
                        onPress={() => navigate("LikeScreen")}
                        activeOpacity={0.6}
                        underlayColor="none"
                    >
                        <Image
                            source={
                                routeName === "LikeScreen"
                                    ? require("../../assets/icons/like_pink.png")
                                    : require("../../assets/icons/like_black.png")
                            }
                            style={
                                routeName === "LikeScreen"
                                    ? styles.menuItemIcon2
                                    : styles.menuItemIcon
                            }
                        />
                    </TouchableHighlight>
                </View>



                <View style={styles.menuItem}>
                    <TouchableHighlight
                        onPress={() => navigate("MessagesScreen")}
                        activeOpacity={0.6}
                        underlayColor="none"
                    >
                        <Image
                            source={
                                routeName === "MessagesScreen"
                                    ? require("../../assets/icons/message_pink.png")
                                    : require("../../assets/icons/message_black.png")
                            }
                            style={
                                routeName === "MessagesScreen"
                                    ? styles.menuItemIcon2
                                    : styles.menuItemIcon
                            }
                        />
                    </TouchableHighlight>
                </View>

                <View style={styles.menuItem}>
                    <TouchableHighlight
                        onPress={() => navigate("ProfileScreen")}
                        activeOpacity={0.6}
                        underlayColor="none"
                    >
                        <Image
                            source={
                                routeName === "ProfileScreen"
                                    ? require("../../assets/icons/profile_pink.png")
                                    : require("../../assets/icons/profile_black.png")
                            }
                            style={
                                routeName === "ProfileScreen"
                                    ? styles.menuItemIcon2
                                    : styles.menuItemIcon
                            }
                        />
                    </TouchableHighlight>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({

    mainbottom_div: {
        backgroundColor: "#FFFFFF",
    },
    bottomcontainer: {
        height: "auto",
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        paddingVertical: 13,
        borderColor: "#FFB6C1",
        borderWidth: 1,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        alignItems: "center",
        
    },
    menuItem: {
        flex: 1,
        alignItems: "center",
    },
    menuItemIcon: {
        height: 40,
        width: 40,
        resizeMode: "contain",
    },
    menuItemIcon2: {
        height: 40,
        width: 40,
        resizeMode: "contain",
    },
});

export default BottomNav;
