import { View, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native'
import React, { useRef, useState } from "react";
import CustomSafeAreaView from '@components/global/CustomSafeAreaView'
import TextComponent from '@components/global/TextComponent'
import { Fonts } from '@utils/Constants'
import PinkButton from '@components/global/PinkButton'
import { navigate } from '@utils/NavigationUtils';

const { width } = Dimensions.get("window");


type Slide = {
  id: string;
  title: string;
  description: string;
  image?: any;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Find your partner \nwith us",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: require("@assets/images/1.png"),
  },
  {
    id: "2",
    title: "Dating better than \never before",
    description:
      "Swipe right and start conversations with amazing people around you.",
    image: require("@assets/images/3.png"),
  },
  {
    id: "3",
    title: "Find your perfect \nmatch",
    description:
      "Discover meaningful connections and build lasting relationships.",
    image: require("@assets/images/2.png"),
  },
];

const WelcomeScreen = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigate('loginScreen')
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx > 50) {
          setCurrentIndex(prevIndex => {
            if (prevIndex > 0) {
              const newIndex = prevIndex - 1;
              flatListRef.current?.scrollToIndex({ index: newIndex });
              console.log("Updated index:", newIndex);
              return newIndex;
            }
            return prevIndex; 
          });
        } else if (gestureState.dx < -50) {
          setCurrentIndex(prevIndex => {
            if (prevIndex < slides.length - 1) {
              const newIndex = prevIndex + 1;
              flatListRef.current?.scrollToIndex({ index: newIndex });
              console.log("Updated index:", newIndex);
              return newIndex;
            }
            return prevIndex; 
          });
        }
      },
    })
  ).current;
  
  



  return (
    <View style={styles.container}>
      <CustomSafeAreaView>
        <View style={styles.inner_container}>

          <Image
            source={slides[currentIndex].image}
            style={styles.image}
            resizeMode="contain"
            {...panResponder.panHandlers}
          />



          <View style={styles.pinkbox}>
            <FlatList
              data={slides}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (


                <View style={styles.textContainer}>

                  <TextComponent style={styles.headtitle}>
                    {item.title}
                  </TextComponent>
                  <TextComponent style={styles.paratitle}>
                    {item.description}
                  </TextComponent>
                </View>
              )}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
              ref={flatListRef}
            />
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex
                      ? styles.activeDot
                      : styles.inactiveDot
                  ]}
                />
              ))}
            </View>

            <PinkButton
              text={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
              onPress={handleNext}
            />




          </View>
        </View>
      </CustomSafeAreaView>


    </View>
  );
};

export default WelcomeScreen


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  inner_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  pinkbox: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    backgroundColor: '#FFE3E8',
    borderWidth: 1,
    borderColor: '#FFB6C1',
    padding: 16,
    gap: 14,
    borderRadius: 16,
    shadowColor: "#FF7F7F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,

  },
  headtitle: {
    fontFamily: Fonts.Poppins_Bold_700,
    fontSize: 28,
    color: '#000000',
    textAlign: 'center',
  },
  paratitle: {
    fontFamily: Fonts.Poppins_Regular_400,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  image: {
    width: width,
    height: 300,
    marginBottom: 32,
  },
  textContainer: {
    width: width * 0.8,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  inactiveDot: {
    height: 8,
    backgroundColor: "#FF6B6B",
  },

  activeDot: {
    height: 12,
    backgroundColor: "#FFFFFF",
  },

})








