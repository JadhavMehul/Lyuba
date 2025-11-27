import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    Alert,
} from 'react-native';

import auth from "@react-native-firebase/auth";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import { ENV, Fonts } from '@utils/Constants';
import ProfileCard from '@components/global/ProfileCard';

const { width } = Dimensions.get('window');



type Person = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  provider: string;
  gender: string;
  birthdate: string;
  city: string;
  pincode: string;
  pictures: string[];
  interests: string[];
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  personalData: {
    profession: string;
    feet: string;
    inch: string;
    education: string;
    religion: string;
    sign: string;
    workingAt: string;
    status: string;
    drinking: string;
    smoking: string;
    workout: string;
    looking: string;
    kids: string;
    genderPreference: string;
  };
}

export default function LikeScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const [likedMeData, setLikedMeData] = useState< Person[] >([]);
    const [matchedData, setMatchedData] = useState([]);
    const [loading, setLoading] = useState(false);


    // Keep track of the "committed" offset and the active tab in refs so
    // gesture callbacks always read the latest value.
    const currentOffset = useRef(0); // in px, 0 or -width
    const activeTabRef = useRef(activeTab);
    activeTabRef.current = activeTab;

    const getLikedMe = async (userId: string) => {
        try {
            if (!userId) {
                Alert.alert("User Not found", "Error getting current user please try again later")
                return;
            }

            const api = `${ENV.API_IP}:3000/api/userDetails/likedMe`;

            const res = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId
                }),
            })

            const likedMeData = await res.json();

            return likedMeData;
            
        } catch (error) {
            console.log("errrrrrror", error);
        }
    }

    const fetchData = async (tabIndex: number) => {
        try {
            setLoading(true);
            const userId = auth().currentUser?.uid;

            if (!userId) {
                Alert.alert("User Not found", "Error getting current user")
                return;
            }

            if (tabIndex === 0) {
                const res = await getLikedMe(userId);
                setLikedMeData(res?.data || []);
                
            } else {
                // const res = await getMatched(userId);
                // setMatchedData(res?.data || []);
                console.log("call matched api");
                
            }
        } catch (err) {
            console.log("Error fetching:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleTabPress = (index: number) => {
        setActiveTab(index);
        activeTabRef.current = index;
        Animated.spring(scrollX, {
            toValue: -index * width,
            useNativeDriver: true,
        }).start(() => {
            currentOffset.current = -index * width;
        });
    };

    // PanResponder: allow horizontal drag but only in the allowed direction.
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const { dx, dy } = gestureState;
                // must be primarily horizontal and exceed small threshold
                if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return false;

                // allow gesture only if it is in the allowed direction:
                // - activeTab 0 (Liked Me): allow left drags (dx < 0)
                // - activeTab 1 (Matched): allow right drags (dx > 0)
                if (activeTabRef.current === 0 && dx < 0) return true;
                if (activeTabRef.current === 1 && dx > 0) return true;
                return false;
            },

            onPanResponderMove: (_, gestureState) => {
                const { dx } = gestureState;
                // Only update if gesture is in allowed direction for current tab
                if (activeTabRef.current === 0 && dx < 0) {
                    // dragging left from page 0 towards -width
                    let next = currentOffset.current + dx;
                    next = Math.max(Math.min(next, 0), -width); // clamp between -width and 0
                    scrollX.setValue(next);
                } else if (activeTabRef.current === 1 && dx > 0) {
                    // dragging right from page 1 towards 0
                    let next = currentOffset.current + dx;
                    next = Math.max(Math.min(next, 0), -width);
                    scrollX.setValue(next);
                }
            },

            onPanResponderRelease: (_, gestureState) => {
                const { dx, vx } = gestureState;
                let newIndex = activeTabRef.current;

                // thresholds: either distance or velocity will switch
                const distanceThreshold = width * 0.25;
                const velocityThreshold = 0.5;

                if (activeTabRef.current === 0) {
                    // from Liked Me -> allow swipe left to Matched
                    if (dx < -distanceThreshold || vx < -velocityThreshold) newIndex = 1;
                } else {
                    // from Matched -> allow swipe right to Liked Me
                    if (dx > distanceThreshold || vx > velocityThreshold) newIndex = 0;
                }

                handleTabPress(newIndex);
            },
        })
    ).current;




    useEffect(() => {
        fetchData(0);
    }, []);


    return (
        <CustomSafeAreaView>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container2}>
                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 0 && styles.activeTab]}
                            onPress={() => handleTabPress(0)}
                        >
                            <Text style={[styles.tabText, activeTab === 0 && styles.activeText]}>
                                Liked Me
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 1 && styles.activeTab]}
                            onPress={() => handleTabPress(1)}
                        >
                            <Text style={[styles.tabText, activeTab === 1 && styles.activeText]}>
                                Matched
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content Area */}
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.contentWrapper,
                            {
                                transform: [{ translateX: scrollX }],
                            },
                        ]}
                    >
                        {/* Page 1: Liked Me */}
                        <View style={[styles.page, {  padding: 24 }]}>

                            <ScrollView

                                showsVerticalScrollIndicator={false}

                            >
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16, justifyContent: 'center', }}>
                                    {likedMeData.map((item, index) => (
                                        <ProfileCard
                                            key={index}
                                            image={{ uri: item.pictures[0] }}
                                            name={`${item.firstName} ${item.lastName}`}
                                            role={item.personalData?.profession ?? ''}
                                        />
                                    ))}
                                </View>
                            </ScrollView>



                        </View>

                        {/* Page 2: Matched */}
                        <View style={[styles.page, {  padding: 24 }]}>

                            <ScrollView

                                showsVerticalScrollIndicator={false}

                            >
                                <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16, justifyContent: 'center', }}>
                                <ProfileCard
                                        image={require("@assets/images/person.png")}
                                        name="Sai Tamankar"
                                        role="UI/UX Designer"
                                    />
                                    <ProfileCard
                                        image={require("@assets/images/person.png")}
                                        name="Sai Tamankar"
                                        role="UI/UX Designer"
                                    />
                                    <ProfileCard
                                        image={require("@assets/images/person.png")}
                                        name="Sai Tamankar"
                                        role="UI/UX Designer"
                                    />
                                </View>
                            </ScrollView>

                        </View>
                    </Animated.View>
                </View>
            </View>
            <BottomNav />
        </CustomSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container2: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#666666',
    },
    activeTab: {
        backgroundColor: '#FFE3E8',
        borderColor: '#FF7F7F',
        borderWidth: 1,
    },
    tabText: {
        fontSize: 17,
        fontFamily: Fonts.Poppins_SemiBold_600,
        color: '#000000',
    },
    activeText: {
        color: '#000000',
    },
    contentWrapper: {
        flexDirection: 'row',
        width: width * 2,
        flex: 1,
    },
    page: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
