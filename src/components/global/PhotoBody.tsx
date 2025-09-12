import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";

type Props = {
  imageUri?: string | null;
  onChange: (uri: string | null) => void;
};

const PhotoBody: React.FC<Props> = ({ imageUri = null, onChange }) => {
  const pickImage = async () => {
    try {
      const options: any = {
        cropping: true,
        freeStyleCropEnabled: false, // disable free crop
        compressImageQuality: 0.9,
        mediaType: "photo",
        multiple: false,
        // Force 9:16 ratio (e.g. 900x1600)
        width: 900,
        height: 1600,
        cropperToolbarTitle: "Crop to 9:16",
      };

      const result: ImageOrVideo | ImageOrVideo[] = await ImagePicker.openPicker(options);

      if (!Array.isArray(result) && result?.path) {
        onChange(result.path);
      } else {
        onChange(null);
      }
    } catch (err: any) {
      if (err?.code === "E_PICKER_CANCELLED") return; // user cancelled
      console.error("ImagePicker error:", err);
      Alert.alert("Error", "Unable to pick image.");
    }
  };

  const removeImage = () => onChange(null);

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteBtn} onPress={removeImage}>
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
            style={{ width: 28, height: 28 }}
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
    height: 160,
    backgroundColor: "#ffe6eb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 6,
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
