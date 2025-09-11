import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { launchImageLibrary, ImageLibraryOptions } from "react-native-image-picker";

type Props = {
  imageUri?: string;
  onChange: (uri: string | null) => void;
};

const PhotoBody: React.FC<Props> = ({ imageUri, onChange }) => {
  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        onChange(response.assets[0].uri || null);
      }
    });
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onChange(null)}>
            <Image
              source={require("@assets/icons/deleteicon.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Image
            source={require("@assets/icons/addicon.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PhotoBody;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 130,
    backgroundColor: "#ffe6eb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  addBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 5,
    borderRadius: 20,
  },
});




// import React, { useState, useEffect } from "react";import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

// type PhotoBodyProps = {
//   initialState?: boolean; // true = add icon, false = delete icon
//   onToggle?: (isAddIcon: boolean) => void;
// };

// export default function PhotoBody({ initialState = true, onToggle }: PhotoBodyProps) {
//   const [toggle, setToggle] = useState(initialState);

//   const handlePress = () => {
//     const newState = !toggle;
//     setToggle(newState);
//     onToggle?.(newState);
//   };
//     useEffect(() => {
//         setToggle(initialState);
//       }, [initialState]);

//   return (
//     <View style={styles.photocontainer}>
//       <View style={styles.toggleicon}>
//         <TouchableOpacity onPress={handlePress}>
//           <Image
//             source={
//               toggle
//                 ? require("@assets/icons/addicon.png")
//                 : require("@assets/icons/deleteicon.png")
//             }
//             style={styles.image}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
  
//     photocontainer: {
//         width: 100,
//         height: 129,
//         backgroundColor: '#FFE3E8',
//         borderRadius: 8,
//         position: 'relative',
//     },
//     toggleicon: {
//         position: 'absolute',
//         bottom: -12,
//         width: '100%',
//         alignItems: 'center',
//     },
//     image: {
//         width: 24,
//         height: 24,

//     },
// });
