// WelcomeScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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
    title: "Find your partner with us",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    // image: require("../assets/slide1.png"),
  },
  {
    id: "2",
    title: "Connect and Chat",
    description:
      "Swipe right and start conversations with amazing people around you.",
    // image: require("../assets/slide2.png"),
  },
  {
    id: "3",
    title: "Build a Relationship",
    description:
      "Discover meaningful connections and build lasting relationships.",
    // image: require("../assets/slide3.png"),
  },
];

const WelcomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Go to next slide
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {

      navigate('loginScreen')
      // Last slide → navigate to Home
      // navigation.navigate("Home" as never);
    }
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Image that changes with text swiping */}
      {/* <Image
        source={slides[currentIndex].image}
        style={styles.image}
        resizeMode="contain"
      /> */}

      {/* FlatList Carousel for text */}
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        ref={flatListRef}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? "#FF6B6B" : "#ccc" },
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: width * 0.7,
    height: 200,
    marginBottom: 20,
  },
  textContainer: {
    width,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
