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
} from 'react-native';
import auth from "@react-native-firebase/auth";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import TextComponent from '@components/global/TextComponent';
import { ENV, Fonts } from '@utils/Constants';
import ReadMoreText from '@components/global/ReadMoreText';
import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from 'react-native-linear-gradient';
import PinkButton from '@components/global/PinkButton';
import { navigate } from '@utils/NavigationUtils';

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
// type Person = {
//   id: string;
//   name: string;
//   title: string;
//   image: any;
// };

// const PEOPLE: Person[] = [
//   { id: '1', name: 'Sai Tamankar', title: 'UI/UX Designer', image: require('@assets/images/person.png') },
//   { id: '2', name: 'Aisha Khan', title: 'Frontend Dev', image: require('@assets/images/person.png') },
//   { id: '3', name: 'Rohit Patel', title: 'Product Manager', image: require('@assets/images/person.png') },
//   { id: '4', name: 'Maya Rao', title: 'Photographer', image: require('@assets/images/person.png') },
//   { id: '5', name: 'Karan Mehta', title: 'Android Dev', image: require('@assets/images/person.png') },
//   { id: '6', name: 'Nisha Verma', title: 'Data Scientist', image: require('@assets/images/person.png') },
// ];


export default function HomeScreen() {
  const userDetails = auth().currentUser;
  // 👇 CHANGE 1: Converted static PEOPLE array to dynamic state
  const [people, setPeople] = useState < Person[] > ([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0); // Keeping index, but its value should remain 0 now
  const [isShrunk, setIsShrunk] = useState(false);
  const [finished, setFinished] = useState(false);

  const cardHeight = useRef(new Animated.Value(CARD_FULL)).current;
  const pos = useRef(new Animated.ValueXY({
    x: 0,
    y: 0
  })).current;
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
    Animated.timing(cardHeight, {
      toValue: CARD_SHRUNK,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      setIsShrunk(true);
    });
  }, [cardHeight]);

  const restartList = useCallback(() => {
    setFinished(false);
    setIndex(0);
    pos.setValue({
      x: 0,
      y: 0
    });
    Animated.timing(cardHeight, {
      toValue: CARD_FULL,
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      setIsShrunk(false);
    });
    // Re-fetch data on restart if necessary
    swipingData();
  }, [pos, cardHeight]);


  const swypedUser = async (swypedUid: string, swypedStatus: string) => {
    const userId = userDetails?.uid;

    if (!userId || !swypedUid || !swypedStatus) {
      console.log('Error in fetching userId, swypedUid, swypedStatus');
      return; 
    }

    const payload = {
      userId,
      swipedUserId: swypedUid,
      swypedStatus
    };

    const api = `${ENV.API_IP}:3000/api/userDetails/swypedUser`;

    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload), 
      });

      const data = await res.json();
      console.log(data);

    } catch (error) {
      console.log("Error in swypedUser API:", error);
    }
  };



  // 👇 CHANGE 3: Updated animateOff to remove the first element from 'people' state
  const animateOff = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      if (finished || people.length === 0) return;

      const swipedPerson = people[0]; // Now, current person is always people[0]

      let toValue = {
        x: 0,
        y: 0
      };
      if (direction === 'left') {
        toValue = {
          x: -SCREEN_W * 1.2,
          y: 0
        };
        swypedUser(swipedPerson.id, 'Rejected');
      } else if (direction === 'right') {
        toValue = {
          x: SCREEN_W * 1.2,
          y: 0
        };
        swypedUser(swipedPerson.id, 'Liked');
      } else if (direction === 'up') {
        toValue = {
          x: 0,
          y: -SCREEN_H * 1.2
        };
        swypedUser(swipedPerson.id, 'SuperLiked');
      }

      // console.log(
      //   "👉 Swiped person:",
      //   swipedPerson.firstName,
      //   "| ID:", swipedPerson.id,
      //   "| Direction:", direction
      // );

      // Log swipe action to server (You should implement this here!)
      // e.g., sendSwipeAction(swipedPerson.id, direction);
      Animated.timing(pos, {
        toValue,
        duration: 280,
        useNativeDriver: false,
      }).start(() => {
        // Remove the swiped card (the first element)
        setPeople(prevPeople => {
          const nextPeople = prevPeople.slice(1);
          if (nextPeople.length === 0) {
            setFinished(true);
          }
          return nextPeople;
        });
        // The index state is effectively reset/ignored, but we ensure it's not incremented.
        setIndex(0);

        requestAnimationFrame(() => {
          pos.setValue({
            x: 0,
            y: 0
          });

          Animated.timing(cardHeight, {
            toValue: CARD_FULL,
            duration: 220,
            useNativeDriver: false,
          }).start(() => {
            setIsShrunk(false);
          });
        });
      });
    },
    [cardHeight, pos, finished, people], // Dependencies updated to include 'people'
  );




  const panResponder = useMemo(
    () =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        (pos as any).extractOffset();
      },
      onPanResponderMove: Animated.event([null, {
        dx: pos.x,
        dy: pos.y
      }], {
        useNativeDriver: false
      }),
      onPanResponderRelease: (_e, gesture) => {
        (pos as any).flattenOffset();
        const {
          dx,
          dy
        } = gesture;
        if (dx > SWIPE_THRESHOLD) {
          animateOff('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          animateOff('left');
        } else if (dy < -SWIPE_THRESHOLD) {
          animateOff('up');
        } else {
          Animated.spring(pos, {
            toValue: {
              x: 0,
              y: 0
            },
            useNativeDriver: false,
            tension: 40,
            friction: 6
          }).start();
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

  // 👇 CHANGE 4: Reference the first and second elements in the dynamic array
  const person = useMemo(() => people[0], [people]);
  const nextPerson = useMemo(() => people[1], [people]);


  // 👇 CHANGE 2: Updated swipingData to populate 'people' state
  const swipingData = async () => {

    setIsLoading(true);
    try {
      const userDetails = auth().currentUser;
      if (!userDetails) {
        Alert.alert("User Not found", "Error getting current user")
        return;
      }
      const userId = userDetails?.uid;
      console.log(userId);

      const api = `${ENV.API_IP}:3000/api/userDetails/peopleProfile`;

      const res = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId
        }),
      })

      const swipingData = await res.json();

      if (swipingData && Array.isArray(swipingData.matches)) {
        const newPeople = swipingData.matches.map((match: {
          user: Person;
        }) => match.user);
        setPeople(newPeople);
        setIndex(0); // Ensure index is reset
        if (newPeople.length === 0) setFinished(true);
      } else {
        Alert.alert("Users Data Not Found", "");
        setPeople([]);
        setFinished(true);
      }
    } catch (error) {
      console.log("errrrrrror", error);
      setPeople([]);
      setFinished(true);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    swipingData();
  }, [])


  return (
    <CustomSafeAreaView>
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
                    key={`next-${nextPerson.id}`}
                    style={[
                      styles.carddiv,
                      {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        transform: [
                          {
                            scale: pos.x.interpolate({
                              inputRange: [-SCREEN_W, 0, SCREEN_W],
                              outputRange: [1, 0.95, 1],
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
                          outputRange: [0.3, 0.1, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    ]}
                  >
                    <Image source={{ uri: nextPerson?.pictures[0] }} style={styles.image} resizeMode="cover" />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1.2 }}
                      style={styles.textofcard}
                    >
                      <TextComponent style={styles.tt1}>{`${nextPerson.firstName} ${nextPerson.lastName}`} </TextComponent>
                      <TextComponent style={styles.tt2}>{nextPerson.personalData?.profession}</TextComponent>
                    </LinearGradient>
                  </Animated.View>
                )}


                {person && (
                  <Animated.View
                    key={`current-${person.id}`}
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
                      <Image source={{ uri: person?.pictures[0] }} style={styles.image} resizeMode="cover" />
                      {!isShrunk && (
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.6)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1.2 }}
                          style={styles.textofcard}
                        >
                          <TextComponent style={styles.tt1}>{`${person.firstName} ${person.lastName}`}</TextComponent>
                          <TextComponent style={styles.tt2}>{person.personalData?.profession}</TextComponent>
                        </LinearGradient>
                      )}
                    </Pressable>
                  </Animated.View>
                )}
              </Animated.View>



              <View style={styles.detailsContainer}>
                <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                  <View style={styles.bottomprofile}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'column' }}>
                        {person && (
                          <>
                            <TextComponent style={styles.title1}>
                              {`${person.firstName} ${person.lastName}`}
                            </TextComponent>
                            {
                              person.personalData?.profession && (
                                <TextComponent style={styles.title2}>
                                  {`${person.personalData?.profession}`}
                                </TextComponent>
                              )
                            }
                          </>
                        )}
                        

                      </View>
                      <TouchableOpacity onPress={() => navigate("MessageScreen2", {myId: userDetails?.uid, otherUserId: person.id})}>
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
                        text={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry "}
                        numberOfChars={100}
                        textStyle={styles.title3}
                        readMoreTextStyle={{ color: '#FF7F7F' }}
                      />
                      {/* <TextComponent style={styles.title3}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry te ...Read More
                                </TextComponent> */}
                    </View>
                    <View style={styles.line}>

                    </View>
                    <View>
                      <TextComponent style={styles.title1}>
                        Location
                      </TextComponent>
                      {
                        person && (
                          <TextComponent style={styles.title3}>
                            {person.city}
                          </TextComponent>
                        )
                      }
                      
                    </View>
                    <View style={styles.line}>

                    </View>
                    <View>
                      <TextComponent style={styles.title1}>
                        Interset
                      </TextComponent>
                      <View style={styles.container2}>
                        {
                          person && (
                            person.interests.map((interestLabel, index) => {
                              const interestItem = INTERESTS.find(i => i.label === interestLabel);

                              return (
                                <View
                                  key={index}
                                  style={[styles.chip]}
                                >
                                  {interestItem?.icon && (
                                    <Icon
                                      name={interestItem.icon}
                                      size={18}
                                      color={"#000"}
                                      style={{ marginRight: 6 }}
                                    />
                                  )}
                                  <TextComponent style={[styles.text]}>
                                    {interestLabel}
                                  </TextComponent>
                                </View>
                              );
                            })
                          )
                        }
                        
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
                            person?.pictures.map((item, index) => {
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