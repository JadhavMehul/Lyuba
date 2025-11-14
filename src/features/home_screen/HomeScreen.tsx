// HomeScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from "@react-native-firebase/auth";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import ReadMoreText from '@components/global/ReadMoreText';
import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_SHRUNK = SCREEN_H * 0.4; // 40% target
const CARD_FULL = SCREEN_H * 0.77; // initial 
const SWIPE_THRESHOLD = 120;

const { width: screenWidth } = Dimensions.get("window");
const INTERESTS = [
  { id: "1", label: "Movie", icon: "film" },
  { id: "2", label: "Cycling", icon: "bicycle" },
  { id: "3", label: "Cooking", icon: "cutlery" },
  { id: "4", label: "Swimming", icon: "life-ring" },
  { id: "5", label: "Coding", icon: "code" },


];

// type Person = {
//   id: string;
//   name: string;
//   title: string;
//   image: any;
// };

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


const PEOPLE: Person[] = [
  {
    id: "k1Tn5aUks8WWTq5m8aYc4thWI8z2",
    lastName: "Jadhav",
    pincode: "400063",
    birthdate: "19/11/2000",
    gender: "male",
    city: "Mumbai",
    pictures: [
      "https://firebasestorage.googleapis.com/v0/b/lyuba-dating-app.firebasestorage.app/o/users%2Fk1Tn5aUks8WWTq5m8aYc4thWI8z2%2Fphotos%2Fphoto_0.jpg?alt=media&token=f0105f13-7b54-4eac-96e7-c237d5542984"
    ],
    createdAt: {
      _seconds: 1760809849,
      _nanoseconds: 511000000
    },
    firstName: "Mehul",
    uid: "k1Tn5aUks8WWTq5m8aYc4thWI8z2",
    provider: "facebook.com",
    interests: [
      "Movie",
      "Swimming",
      "Coding",
      "Gaming"
    ],
    email: "jadhavmehuljadhav.mj@gmail.com",
    personalData: {
      profession: "",
      feet: "",
      drinking: "",
      education: "No formal education",
      sign: "",
      workingAt: "",
      religion: "Hinduism",
      workout: "",
      smoking: "",
      looking: "",
      inch: "",
      kids: "",
      status: "",
      genderPreference: "male"
    }
  },
];



export default function HomeScreen() {

  // const [PEOPLE, setPEOPLE] = useState([]);
  const [index, setIndex] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cardHeight = useRef(new Animated.Value(CARD_FULL)).current;
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const paddingAnim = useRef(new Animated.Value(24)).current;

  const rotate = pos.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const expandCard = useCallback(() => {
    Animated.parallel([
      Animated.timing(cardHeight, {
        toValue: CARD_FULL,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(paddingAnim, {
        toValue: 24,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setIsShrunk(false));
  }, [cardHeight, paddingAnim]);


  const shrinkCard = useCallback(() => {
    Animated.timing(cardHeight, { toValue: CARD_SHRUNK, duration: 300, useNativeDriver: false }).start(() => {
      setIsShrunk(true);
    });
  }, [cardHeight]);

  const restartList = useCallback(() => {
    setFinished(false);
    setIndex(0);
    pos.setValue({ x: 0, y: 0 });
    Animated.timing(cardHeight, { toValue: CARD_FULL, duration: 250, useNativeDriver: false }).start(() => {
      setIsShrunk(false);
    });
  }, [pos, cardHeight]);

  const animateOff = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      if (finished) return;

      const currentPerson = PEOPLE[index];
      let toValue = { x: 0, y: 0 };
      if (direction === 'left') {
        toValue = { x: -SCREEN_W * 1.2, y: 0 };
        console.log(currentPerson.firstName, currentPerson.uid);
        console.log('reject');
      }
      if (direction === 'right') {
        toValue = { x: SCREEN_W * 1.2, y: 0 };
        console.log('accepted');
      }
      if (direction === 'up') {
        toValue = { x: 0, y: -SCREEN_H * 1.2 };
        console.log('superlike');
      }

      Animated.timing(pos, { toValue, duration: 280, useNativeDriver: false }).start(() => {
        pos.setValue({ x: 0, y: 0 });
        Animated.timing(cardHeight, { toValue: CARD_FULL, duration: 220, useNativeDriver: false }).start(() => {
          setIsShrunk(false);
          setIndex(prev => {
            const next = prev + 1;
            if (next < PEOPLE.length) {
              return next;
            } else {
              setFinished(true);
              return prev;
            }
          });
        });
      });
    },
    [cardHeight, pos, finished],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          (pos as any).extractOffset();
        },
        onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_e, gesture) => {
          (pos as any).flattenOffset();
          const { dx, dy } = gesture;
          if (dx > SWIPE_THRESHOLD) {
            animateOff('right');
          } else if (dx < -SWIPE_THRESHOLD) {
            animateOff('left');
          } else if (dy < -SWIPE_THRESHOLD) {
            animateOff('up');
          } else {
            Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, tension: 40, friction: 6 }).start();
          }
        },
      }),
    [pos, animateOff],
  );

  // ✅ Fix: BackHandler that always works
  useEffect(() => {
    const onBackPress = () => {
      if (isShrunk) {
        expandCard();
        return true; // handled
      }
      return false; // let default navigation handle it
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isShrunk, expandCard]);

  function toggleShrink() {
    if (finished) return;

    if (!isShrunk) {
      Animated.parallel([
        Animated.timing(cardHeight, {
          toValue: CARD_SHRUNK,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(paddingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setIsShrunk(true));
    } else {
      Animated.parallel([
        Animated.timing(cardHeight, {
          toValue: CARD_FULL,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(paddingAnim, {
          toValue: 24,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setIsShrunk(false));
    }
  }


  const onButtonAction = useCallback(
    (action: 'left' | 'center' | 'right') => {
      if (action === 'left') {
        console.log('reject');
        animateOff('left');
      }
      if (action === 'center') {
        console.log('superlike');
        animateOff('up');
      }
      if (action === 'right') {
        console.log('accepted');
        animateOff('right');
      }
    },
    [animateOff],
  );

  const person = PEOPLE[index];
  const nextPerson = PEOPLE[index + 1];


  const swipingData = async () => {

    setIsLoading(true);
    try {
      const userDetails = auth().currentUser;
      if (!userDetails) {
        Alert.alert("User Not found", "Error getting current user")
      }
      const userId = userDetails?.uid;
      console.log(userId);

      const api = `${ENV.API_IP}:3000/api/userDetails/peopleProfile`;

      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const swipingData = await res.json();
              
      if (swipingData) {
          // setPEOPLE(swipingData.matches);
          PEOPLE.length = 0;
          swipingData.matches.forEach((object: { user: Person; }) => {
            PEOPLE.push(object.user)
            console.log(object.user);
          });


          // console.log(swipingData.matches[1].user.firstName);
          // console.log(typeof(swipingData));
          
          
      } else {
          Alert.alert("Users Data Not Found", "");
      }
    } catch (error) {
      console.log("errrrrrror", error);
    } finally {
      setIsLoading(false);
    }
    
  }


  useEffect(() => {
    swipingData();
  }, [])

  return (
    <CustomSafeAreaView>
      {
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animated.View
              style={[
                styles.mainbg,
                { paddingTop: paddingAnim, paddingHorizontal: paddingAnim }
              ]}
            >
              {finished ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={[styles.carddiv, { width: '100%', height: CARD_FULL, justifyContent: 'center', alignItems: 'center' }]}>
                    <TextComponent style={{ fontFamily: Fonts.Poppins_SemiBold_600, fontSize: 20 }}>No more people left</TextComponent>
                    <TouchableOpacity onPress={restartList} style={{ marginTop: 18, padding: 12, borderRadius: 10, backgroundColor: '#EFEFEF' }}>
                      <Text>Restart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Animated.View style={[styles.cardWrapper, { height: cardHeight }]}>
                    {nextPerson && (
                      <Animated.View
                        style={[
                          styles.carddiv,
                          {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            // 👇 next card starts slightly smaller and hidden
                            transform: [
                              {
                                scale: pos.x.interpolate({
                                  inputRange: [-SCREEN_W, 0, SCREEN_W],
                                  outputRange: [1, 0.95, 1], // 0.95 by default, grows to 1 as swipe happens
                                  extrapolate: 'clamp',
                                }),
                              },
                              {
                                scale: pos.y.interpolate({
                                  inputRange: [-SCREEN_H, 0, SCREEN_H],
                                  outputRange: [1, 0.95, 1],
                                  extrapolate: 'clamp',
                                }),
                              },
                            ],
                            opacity: pos.x.interpolate({
                              inputRange: [-SCREEN_W, 0, SCREEN_W],
                              outputRange: [0.3, 0.1, 1], // a bit faint, brightens as swipe progresses
                              extrapolate: 'clamp',
                            }),
                          },
                        ]}
                      >
                        <Image source={{ uri : person.pictures[0] }} style={styles.image} resizeMode="cover" />
                        <View style={styles.textofcard}>
                          <TextComponent style={styles.tt1}>{nextPerson.firstName}</TextComponent>
                          <TextComponent style={styles.tt2}>{nextPerson.personalData.profession}</TextComponent>
                        </View>
                      </Animated.View>
                    )}





                    <Animated.View
                      {...(!isShrunk ? panResponder.panHandlers : {})}
                      style={[
                        styles.carddiv,
                        {
                          borderTopLeftRadius: isShrunk ? 0 : 20,
                          borderTopRightRadius: isShrunk ? 0 : 20,
                          transform: [
                            { translateX: pos.x },
                            { translateY: pos.y },
                            { rotate },
                          ],
                        },
                      ]}
                    >

                      <Pressable style={{ flex: 1 }} onPress={toggleShrink}>
                        <Image source={{ uri : person.pictures[0] }} style={styles.image} resizeMode="cover" />
                        {!isShrunk && (
                          <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']} // fade from transparent → dark black
                            start={{ x: 0, y: 0 }} // top (transparent)
                            end={{ x: 0, y: 1.2 }}   // bottom (black)
                            style={styles.textofcard}
                          >
                          <>
                            <TextComponent style={styles.tt1}>{person.firstName}</TextComponent>
                            <TextComponent style={styles.tt2}>{person.personalData.profession}</TextComponent>
                          </>
                          </LinearGradient>
                        )}
                      </Pressable>
                    </Animated.View>
                  </Animated.View>

                  <View style={styles.detailsContainer}>
                    <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                      <View style={styles.bottomprofile}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'column' }}>
                            <TextComponent style={styles.title1}>
                              {person.firstName} {person.lastName}
                            </TextComponent>
                            {
                              person.personalData?.profession && (
                                <TextComponent style={styles.title2}>
                                  {person.personalData?.profession}
                                </TextComponent>
                              )
                            }
                            

                          </View>
                          <TouchableOpacity>
                            <Image
                              source={require("@assets/icons/message.png")}
                              style={styles.image2}
                            />

                          </TouchableOpacity>


                        </View>
                        <View style={styles.line}>

                        </View>
                        <View>
                          <TextComponent style={styles.title1}>
                            About
                          </TextComponent>
                          <ReadMoreText
                            text={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry "}
                            numberOfChars={100}
                            textStyle={styles.title3}
                            readMoreTextStyle={{ color: '#FF7F7F' }}
                          />
                          
                        </View>
                        <View style={styles.line}></View>
                        <View>
                          <TextComponent style={styles.title1}>
                            Location
                          </TextComponent>
                            {person.city && (
                              <TextComponent style={styles.title3}>
                                {person.city}
                              </TextComponent>
                            )}
                        </View>
                        <View style={styles.line}></View>
                        <View>
                          <TextComponent style={styles.title1}>
                            Interset
                          </TextComponent>
                          <View style={styles.container2}>
                            {person.interests.map((item, index) => {


                              return (
                                <View
                                  key={index}
                                  style={[styles.chip]}
                                >
                                  {/* <Icon
                                    name={item.icon}
                                    size={18}
                                    color={"#000"}
                                    style={{ marginRight: 6 }}
                                  /> */}
                                  <TextComponent style={[styles.text]}>
                                    {item}
                                  </TextComponent>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                        <View style={styles.line}>

                        </View>
                        <View>
                          <TextComponent style={styles.title1}>
                            Gallery
                          </TextComponent>
                          <View>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}

                            >
                              {
                                person.pictures.map((item, index) => {
                                    return (
                                        <View key={index} style={styles.imagecontainer}>
                                            <Image
                                                source={{ uri: item }}
                                                style={styles.image}
                                                resizeMode='cover'
                                            />
                                        </View>
                                    )
                                })
                              }
                            </ScrollView>
                          </View>

                        </View>
                      </View>
                    </ScrollView>
                  </View>

                  {!isShrunk && (
                    <View style={styles.buttonsdiv}>
                      <TouchableOpacity activeOpacity={0.8} onPress={() => onButtonAction('left')}>
                        <View style={styles.rejectdiv}><Text>r</Text></View>
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity={0.8} onPress={() => onButtonAction('center')}>
                        <View style={styles.superdiv}><Text>s</Text></View>
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity={0.8} onPress={() => onButtonAction('right')}>
                        <View style={styles.acceptdiv}><Text>a</Text></View>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </Animated.View>

            <BottomNav />
          </View>
        )
      }

      
    </CustomSafeAreaView>
  );
}

const styles = StyleSheet.create({
  tt1: { fontFamily: Fonts.Poppins_SemiBold_600, fontSize: 24, color: '#FFFFFF' },
  tt2: { fontFamily: Fonts.Poppins_Medium_500, fontSize: 20, color: '#FFFFFF' },
  mainbg: { flex: 1, paddingTop: 24, paddingHorizontal: 24 },
  cardWrapper: { width: '100%', marginBottom: 8 },
  carddiv: { flex: 1, backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  textofcard: {
    position: 'absolute', bottom: 0, width: '100%', paddingBottom: 50, paddingLeft: 20, paddingTop: 10,


  },
  detailsContainer: { flex: 1, marginTop: 20 },
  buttonsdiv: {
    flexDirection: 'row',
    width: SCREEN_W,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 14,
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  rejectdiv: {
    justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 50, backgroundColor: 'white', borderColor: "#FFE3E8",
    borderWidth: 1,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  acceptdiv: {
    justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 50, backgroundColor: 'white', borderColor: "#FFE3E8",
    borderWidth: 1,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  superdiv: {
    justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: 50, backgroundColor: 'white', borderColor: "#FFE3E8",
    borderWidth: 1,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },

  bottomprofile: {
    padding: 24,
    gap: 16,
    paddingTop: 12,
  },
  title3: {
    fontFamily: Fonts.Poppins_Regular_400,
    fontSize: 16,
    color: '#333333',
    textAlign: 'left',

  },
  title2: {
    fontFamily: Fonts.Poppins_SemiBold_600,
    fontSize: 16,
    color: '#666666',
    textAlign: 'left',
  },
  title1: {
    fontFamily: Fonts.Poppins_SemiBold_600,
    fontSize: 24,
    color: '#000000',
    textAlign: 'left',
  },
  line: {
    height: 1,
    backgroundColor: '#FFC0CB',
    width: '100%',
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
  imagecontainer: {
    zIndex: 1,
    width: 100,
    height: 129,
    backgroundColor: "#ffe6eb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",

  },
  image2: {
    width: 30,
    height: 30,
  },
});
