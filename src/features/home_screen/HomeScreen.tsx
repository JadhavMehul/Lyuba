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
} from 'react-native';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import BottomNav from '@components/global/BottomNav';
import TextComponent from '@components/global/TextComponent';
import { Fonts } from '@utils/Constants';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_SHRUNK = SCREEN_H * 0.4; // 40% target
const CARD_FULL = SCREEN_H * 0.77; // initial 
const SWIPE_THRESHOLD = 120;

type Person = {
  id: string;
  name: string;
  title: string;
  image: any;
  bio?: string;
};

const PEOPLE: Person[] = [
  { id: '1', name: 'Sai Tamankar', title: 'UI/UX Designer', image: require('@assets/images/person.png'), bio: 'Loves design and coffee.' },
  { id: '2', name: 'Aisha Khan', title: 'Frontend Dev', image: require('@assets/images/person.png'), bio: 'React enthusiast.' },
  { id: '3', name: 'Rohit Patel', title: 'Product Manager', image: require('@assets/images/person.png'), bio: 'Builds with data.' },
  { id: '4', name: 'Maya Rao', title: 'Photographer', image: require('@assets/images/person.png'), bio: 'Capturing moments.' },
  { id: '5', name: 'Karan Mehta', title: 'Android Dev', image: require('@assets/images/person.png'), bio: 'Kotlin > Java.' },
  { id: '6', name: 'Nisha Verma', title: 'Data Scientist', image: require('@assets/images/person.png'), bio: 'ML curious.' },
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const [finished, setFinished] = useState(false);

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

      let toValue = { x: 0, y: 0 };
      if (direction === 'left') {
        toValue = { x: -SCREEN_W * 1.2, y: 0 };
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
                    <Image source={nextPerson.image} style={styles.image} resizeMode="cover" />
                    <View style={styles.textofcard}>
                      <TextComponent style={styles.tt1}>{nextPerson.name}</TextComponent>
                      <TextComponent style={styles.tt2}>{nextPerson.title}</TextComponent>
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
                    <Image source={person.image} style={styles.image} resizeMode="cover" />
                    <View style={styles.textofcard}>
                      <TextComponent style={styles.tt1}>{person.name}</TextComponent>
                      <TextComponent style={styles.tt2}>{person.title}</TextComponent>
                    </View>
                  </Pressable>
                </Animated.View>
              </Animated.View>

              <View style={styles.detailsContainer}>
                <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                  <TextComponent style={{ fontFamily: Fonts.Poppins_SemiBold_600, fontSize: 18 }}>
                    {person.name}
                  </TextComponent>
                  <Text style={{ marginTop: 8 }}>{person.bio}</Text>
                  <View style={{ height: 500 }} />
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
  mainbg: { backgroundColor: 'red', flex: 1, paddingTop: 24, paddingHorizontal: 24 },
  cardWrapper: { width: '100%', marginBottom: 8 },
  carddiv: { flex: 1, backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  textofcard: { position: 'absolute', bottom: 50, left: 16 },
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
});
