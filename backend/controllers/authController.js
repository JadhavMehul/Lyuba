const { firestore, auth } = require('../config/firebaseConfig');
const { uploadUserPhoto } = require('../utils/storageUtils');

/**
 * Shared by socialAuth and authenticateUser: verifies the Firebase ID token
 * and looks up (but does not create) the matching Firestore user doc.
 * Both endpoints only differ in their response wording, so the actual
 * verify+lookup logic lives here once instead of being copy-pasted twice.
 */
const verifyAndLookupUser = async (idToken) => {
  const decodedToken = await auth.verifyIdToken(idToken);
  const { uid, email, name, picture } = decodedToken;

  let firstName = "";
  let lastName = "";

  if (name) {
    const parts = name.split(" ");
    firstName = parts[0];
    lastName = parts.slice(1).join(" ");
  }

  const provider = decodedToken.firebase?.sign_in_provider || "unknown";

  const userRef = firestore.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return {
      isNewUser: true,
      user: {
        uid,
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        photoURL: picture || null,
        provider,
      },
    };
  }

  return { isNewUser: false, user: userDoc.data() };
};

exports.socialAuth = async (req, res) => {
  const { idToken } = req.body; // Firebase ID token from frontend

  if (!idToken) {
    return res.status(400).json({ error: "ID Token required" });
  }

  try {
    const { isNewUser, user } = await verifyAndLookupUser(idToken);

    return res.status(200).json({
      message: isNewUser ? "New User" : "Login successful",
      response: { user, profileComplete: !isNewUser },
    });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid ID Token" });
  }
};

exports.authenticateUser = async (req, res) => {
  const { idToken } = req.body; // Firebase ID token from frontend

  if (!idToken) {
    return res.status(400).json({ error: "ID Token required" });
  }

  try {
    const { isNewUser, user } = await verifyAndLookupUser(idToken);

    return res.status(200).json({
      message: isNewUser ? "New User" : "Login Successful",
      response: { user, profileComplete: !isNewUser },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid ID Token" });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const uid = req.user.uid; // you can only register/complete your own profile
    const { email, firstName, lastName, birthdate, gender, city, pincode, interests, personalData, provider } = req.body;
    const files = req.files; // Multer attaches files here


    console.log("Received data:", req.body);
    console.log("Received files:", files?.length);

    const uploadedUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        uploadedUrls.push(await uploadUserPhoto(uid, file));
      }
    }


    // Save user in Firestore
    await firestore.collection("users").doc(uid).set(
      {
        uid,
        email,
        firstName,
        lastName,
        birthdate,
        gender,
        city,
        pincode,
        interests,
        personalData,
        provider,
        pictures: uploadedUrls,
        createdAt: new Date(),
      },
      { merge: true }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      pictures: uploadedUrls,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};