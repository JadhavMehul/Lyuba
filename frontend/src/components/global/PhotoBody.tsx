import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";

type Props = {
  imageUri?: string | null;
  onChange: (uri: string | null) => void;
  /** Fires once the photo has finished loading (or failed to). */
  onLoadEnd?: () => void;
};

const PhotoBody: React.FC<Props> = ({ imageUri = null, onChange, onLoadEnd }) => {
  const pickImage = async () => {
    try {
      const options: any = {
        cropping: true,
        freeStyleCropEnabled: false, // disable free crop
        // Keep the file small. These get uploaded over wifi from the phone,
        // and a multi-megabyte photo is what makes an upload drop halfway.
        // 900x1600 is already more than a phone screen shows.
        compressImageQuality: 0.8,
        compressImageMaxWidth: 900,
        compressImageMaxHeight: 1600,
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
          {/* Tapping an existing photo replaces it in place. This wrapper MUST
              carry the full size — the image is sized in %, which resolves
              against its direct parent, so an unstyled wrapper collapses it
              to 0x0 and the photo silently doesn't render. */}
          <TouchableOpacity style={styles.imageWrapper} onPress={pickImage} activeOpacity={0.8}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              onLoadEnd={onLoadEnd}
            />
          </TouchableOpacity>
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
    zIndex: 1,
    width: 100,
    height: 129,
    backgroundColor: "#ffe6eb",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
    // overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addBtn: {
    zIndex: 999999,
    position: "absolute",
    bottom: -14,
    left: "50%",
  transform: [{ translateX: -14 }],
  },
  deleteBtn: {
    position: "absolute",
    bottom: -14,
    left: "50%",
  transform: [{ translateX: -16 }],
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
