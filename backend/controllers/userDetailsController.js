const { firestore, FieldValue } = require("../config/firebaseConfig");
const { profileByGender, getMatchScore } = require("../utils/usersDetailsUtils");
const { uploadUserPhoto, deleteUserPhotoByUrl } = require("../utils/storageUtils");

exports.profileData = async (req, res) => {
  try {
    // Defaults to your own profile, but callers may look up someone else's
    // (e.g. viewing a match's profile inside a chat) — any signed-in user is
    // allowed to view another dating profile, that's the intended design.
    const userId = req.body.userId || req.user.uid;

    const userDoc = await firestore.collection("users").doc(userId).get();
 
    if (!userDoc.exists) {
      return res.status(404).json({ foundData: false, message: "User not found" });
    }
 
    return res.status(200).json({
      foundData: true,
      message: "User Found",
      response: { user: userDoc.data() },
    });
  } catch (error) {
    console.error("profileData error:", error);
    return res.status(500).json({ error: error.message });
  }
};


exports.editProfileData = async (req, res) => {
  try {

    const { userData } = req.body;

    if (!userData) {
      return res.status(400).json({ error: "userData required" });
    }

    // You can only edit your own profile.
    if (userData.uid !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const userDocRef = firestore.collection("users").doc(userData.uid);

    // Update user data (spread to avoid nesting issues)
    await userDocRef.set(userData, { merge: true });

    // Fetch updated document
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userDoc.data()
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

}




exports.updatePictures = async (req, res) => {
  try {
    const uid = req.user.uid;
    const files = req.files || [];
    const MAX_PICTURES = 6;
 
    // --- parse ---------------------------------------------------------
    let slots;
    try {
      slots = JSON.parse(req.body.slots);
    } catch {
      // Deliberately a hard failure. Swallowing this and falling back to an
      // empty array is how a malformed request ends up wiping a gallery.
      return res
        .status(400)
        .json({ success: false, error: "slots must be a JSON array" });
    }
 
    if (!Array.isArray(slots)) {
      return res
        .status(400)
        .json({ success: false, error: "slots must be a JSON array" });
    }
    if (slots.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "At least one photo is required" });
    }
    if (slots.length > MAX_PICTURES) {
      return res
        .status(400)
        .json({ success: false, error: `At most ${MAX_PICTURES} photos are allowed` });
    }
 
    const userRef = firestore.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const currentPictures = userDoc.exists ? userDoc.data().pictures || [] : [];
    const ownedUrls = new Set(currentPictures);
 
    const filesByField = new Map(files.map((f) => [f.fieldname, f]));
 
    // --- validate everything before uploading anything -----------------
    // Uploading first and validating later leaves orphaned files in the
    // bucket whenever a request turns out to be malformed.
    const seenUrls = new Set();
    const seenFields = new Set();
 
    for (const slot of slots) {
      if (!slot || typeof slot !== "object") {
        return res.status(400).json({ success: false, error: "Malformed slot entry" });
      }
 
      if (slot.type === "keep") {
        if (typeof slot.url !== "string" || !ownedUrls.has(slot.url)) {
          // Stops a client from writing an arbitrary URL into a profile.
          return res
            .status(400)
            .json({ success: false, error: "Cannot keep a photo that isn't yours" });
        }
        if (seenUrls.has(slot.url)) {
          return res.status(400).json({ success: false, error: "Duplicate photo in slots" });
        }
        seenUrls.add(slot.url);
      } else if (slot.type === "upload") {
        if (typeof slot.field !== "string" || !filesByField.has(slot.field)) {
          return res
            .status(400)
            .json({ success: false, error: `Missing file for slot ${slot.field}` });
        }
        if (seenFields.has(slot.field)) {
          return res.status(400).json({ success: false, error: "Duplicate file in slots" });
        }
        seenFields.add(slot.field);
      } else {
        return res.status(400).json({ success: false, error: "Unknown slot type" });
      }
    }
 
    // --- build the new gallery -----------------------------------------
    // Uploaded in parallel, not one-at-a-time: each upload is a round trip to
    // Storage, and serialising them made a 4-photo save take 20-40s, which is
    // long enough for a phone on flaky wifi to give up mid-request.
    // Promise.all resolves positionally, so photo order is still preserved.
    const finalPictures = await Promise.all(
      slots.map((slot) =>
        slot.type === "keep"
          ? slot.url
          : uploadUserPhoto(uid, filesByField.get(slot.field))
      )
    );
 
    await userRef.set({ pictures: finalPictures }, { merge: true });
 
    // --- clean up what's no longer referenced ---------------------------
    // After the Firestore write, so a failed delete never leaves the profile
    // pointing at a file that's already gone.
    const kept = new Set(finalPictures);
    const removed = currentPictures.filter((url) => !kept.has(url));
 
    await Promise.all(
      removed.map((url) =>
        deleteUserPhotoByUrl(url).catch((err) =>
          console.warn("Failed to delete old photo:", url, err.message)
        )
      )
    );
 
    return res.status(200).json({ success: true, pictures: finalPictures });
  } catch (error) {
    console.error("updatePictures error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
 

exports.peopleProfileData = async (req, res) => {
  try {
    const userId = req.user.uid; // the discovery feed is always "who's shown to me"

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const myGenderPreference = userData.personalData?.genderPreference;
    const myCityPreference = userData.city;


    const result = await profileByGender(myGenderPreference, myCityPreference, userId, userData.blockedUsers);

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({ message: "No matching users found" });
    }

    // Calculate match scores for each candidate
    const matches = result.data.map(otherUser => ({
      user: otherUser,
      score: getMatchScore(userData, otherUser)
    }));


    matches.sort((a, b) => b.score - a.score);

    return res.status(200).json({ matches });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


exports.addUserInLoop = async (req, res) => {
  // const users =  // Expecting JSON array please add data in array of object as shown below

  // [
  //     {
  //         "id": "8l5kvaeQCnAG8c4vROYtV7nfaeAy",
  //         "lastName": "Lee",
  //         "pincode": "E1 6AN",
  //         "birthdate": "14/03/1983",
  //         "gender": "male",
  //         "city": "London",
  //         "personalData": {
  //             "profession": "Lawyer",
  //             "feet": "4 Feet",
  //             "drinking": "No",
  //             "education": "Primary School",
  //             "genderPreference": "Both",
  //             "sign": "Sagittarius",
  //             "workingAt": "",
  //             "religion": "Judaism",
  //             "workout": "Active",
  //             "smoking": "Yes",
  //             "looking": "Marriage",
  //             "inch": "0 Inch",
  //             "kids": "No",
  //             "status": "Unmarried"
  //         },
  //         "pictures": [
  //             "https://firebasestorage.googleapis.com/v0/b/lyuba-dating-app.firebasestorage.app/o/users%2Fk1Tn5aUks8WWTq5m8aYc4thWI8z2%2Fphotos%2Fphoto_0.jpg?alt=media&token=f0105f13-7b54-4eac-96e7-c237d5542984",
  //             "https://firebasestorage.googleapis.com/v0/b/lyuba-dating-app.firebasestorage.app/o/users%2FHx5bjizIdTRKFssDl0SJSP12RnR2%2Fphotos%2Fphoto_0.jpg?alt=media&token=2fad6650-ea59-4771-83c5-516a279e1528"
  //         ],
  //         "createdAt": "October 22, 2025 at 11:03:55 AM UTC+5:30",
  //         "firstName": "Vikram",
  //         "uid": "8l5kvaeQCnAG8c4vROYtV7nfaeAy",
  //         "provider": "facebook.com",
  //         "interests": [
  //             "Movie",
  //             "Football",
  //             "Stock Market",
  //             "Cricket"
  //         ],
  //         "email": "vikram.lee839@example.com"
  //     },
  // ]

  if (!Array.isArray(users)) {
    return res.status(400).send({ error: "Request body must be an array of users" });
  }

  try {
    for (const user of users) {
      await firestore.collection("users").doc(user.uid).set(user);

    }
    res.status(200).send({ message: "All users uploaded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to upload users", details: error.message });
  }

}

exports.test = async (req, res) => {

  try {
    const userRef = firestore.collection("users").where("city", "==", "Mumbai").where("gender", "==", "male");
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return { status: 404, message: "No users found with this gender" };
    }
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send({ data: users });



  } catch (error) {
    console.error(error);
    res.status(404).send({ error: "Failed to get user data", details: error.message });
  }



}

exports.swypedUser = async (req, res) => {

  try {

    const userId = req.user.uid; // you can only record swipes as yourself
    const { swipedUserId, swypedStatus } = req.body;

    if (!userId || !swipedUserId || !swypedStatus) {
      return res.status(400).json({ error: "unable to receive userId or swipedUserId or swypedStatus" });
    }

    const batch = firestore.batch();

    const userIdRef = firestore.collection("swyped").doc(userId);
    batch.set(userIdRef, {
      swypedByMe: FieldValue.arrayUnion({
        swypedTo: swipedUserId,
        swypedStatus: swypedStatus,
        createdAt: new Date(),
      })
    }, { merge: true });

    const swipedUserIdRef = firestore.collection("swyped").doc(swipedUserId);
    batch.set(swipedUserIdRef, {
      swypedByThem: FieldValue.arrayUnion({
        swypedBy: userId,
        swypedStatus: swypedStatus,
        createdAt: new Date(),
      })
    }, { merge: true });

    await batch.commit();

    return res.status(201).json({
      success: true,
      message: "Swyped Successfully"
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }

}

exports.likedMe = async (req, res) => {
  try {
    const userId = req.user.uid; // only your own "who liked me" list

    if (!userId) {
      return res.status(400).json({ error: "unable to receive userId" });
    }

    // 1. Fetch the user's swiped data
    const userRef = firestore.collection("swyped").doc(userId);
    const snapshot = await userRef.get();

    // Check if the document exists and has the necessary data
    if (!snapshot.exists || !snapshot.data().swypedByThem) {
      return res.status(200).json({
        success: true,
        data: [] // No one has swiped on this user yet
      });
    }

    const snapData = snapshot.data().swypedByThem;
    const snapData2 = snapshot.data().swypedByMe;


    // 2. Filter for users who "Liked" the current user
    let likedByUsers = snapData.filter(doc => doc.swypedStatus === "Liked");
    let likedByMe = snapData2.filter(doc => doc.swypedStatus === "Liked");

    const swypedToSet = new Set(likedByMe.map(item => item.swypedTo));

    const filteredArray = likedByUsers.filter(
      item => !swypedToSet.has(item.swypedBy)
    );

    if (filteredArray.length === 0) {
      return res.status(200).json({
        success: true,
        data: [] // No one has swiped on this user yet
      });
    }


    // --- 👇 CRITICAL ADDITION: SORTING LOGIC 👇 ---
    // Sort by createdAt._seconds in descending order (newest first)
    filteredArray.sort((a, b) =>
      b.createdAt._seconds - a.createdAt._seconds
    );
    // --- 👆 CRITICAL ADDITION: SORTING LOGIC 👆 ---

    // 3. Prepare for concurrent fetching
    const likedByUserIds = filteredArray.map(doc => doc.swypedBy);

    // 4. Fetch all user details concurrently using Promise.all and map
    const userPromises = likedByUserIds.map(async (swypedByUserId) => {
      const userDocRef = firestore.collection("users").doc(swypedByUserId);
      const userSnapshot = await userDocRef.get();

      // Return the user data, or null/undefined if not found
      return userSnapshot.exists ? userSnapshot.data() : null;
    });

    // Wait for all the promises to resolve
    let users = await Promise.all(userPromises);

    // Optional: Filter out any null/undefined entries if a user doc was not found
    users = users.filter(user => user !== null);

    // 5. Send the successful response (The `users` array is now sorted)
    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};


exports.matched = async (req, res) => {
  try {
    const userId = req.user.uid; // only your own match list

    if (!userId) {
      return res.status(400).json({ error: "Unable to receive userId" });
    }

    const userRef = firestore.collection("swyped").doc(userId);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const swipedData = snapshot.data();

    // 1. Identify Users Liked by the Current User (swypedByMe)
    const likedByMe = Array.isArray(swipedData.swypedByMe)
      ? swipedData.swypedByMe
        .filter(doc => doc.swypedStatus === "Liked")
        .map(doc => doc.swypedTo)
      : [];

    // 2. Identify Users who Liked the Current User (swypedByThem)
    const likedThem = Array.isArray(swipedData.swypedByThem)
      ? swipedData.swypedByThem
        .filter(doc => doc.swypedStatus === "Liked")
        // Sort by createdAt (newest match first) before mapping to ID
        .sort((a, b) => b.createdAt?._seconds - a.createdAt?._seconds)
        .map(doc => doc.swypedBy)
      : [];

    // 3. Find the similar ID's (The Match)
    // A match is a user ID that exists in BOTH lists.
    const matchedUserIds = likedThem.filter(id => likedByMe.includes(id));

    if (matchedUserIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // 4. Fetch all Matched User Details concurrently
    const userPromises = matchedUserIds.map(async (matchedId) => {
      const userDocRef = firestore.collection("users").doc(matchedId);
      const userSnapshot = await userDocRef.get();

      // Return the user data, or null if not found
      return userSnapshot.exists ? userSnapshot.data() : null;
    });

    // Wait for all the promises to resolve
    let users = await Promise.all(userPromises);

    // console.log(users);


    // Filter out any null entries and keep the matched list clean
    users = users.filter(user => user !== null);

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { blockedUserId } = req.body;

    if (!blockedUserId) {
      return res.status(400).json({ error: "blockedUserId required" });
    }
    if (blockedUserId === userId) {
      return res.status(400).json({ error: "You can't block yourself" });
    }

    await firestore.collection("users").doc(userId).set(
      { blockedUsers: FieldValue.arrayUnion(blockedUserId) },
      { merge: true }
    );

    return res.status(200).json({ success: true, message: "User blocked" });
  } catch (error) {
    console.error("blockUser error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { blockedUserId } = req.body;

    if (!blockedUserId) {
      return res.status(400).json({ error: "blockedUserId required" });
    }

    await firestore.collection("users").doc(userId).set(
      { blockedUsers: FieldValue.arrayRemove(blockedUserId) },
      { merge: true }
    );

    return res.status(200).json({ success: true, message: "User unblocked" });
  } catch (error) {
    console.error("unblockUser error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userDoc = await firestore.collection("users").doc(userId).get();
    const blockedUserIds = userDoc.data()?.blockedUsers || [];

    if (blockedUserIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const userPromises = blockedUserIds.map(async (blockedId) => {
      const doc = await firestore.collection("users").doc(blockedId).get();
      return doc.exists ? { ...doc.data(), uid: blockedId } : null;
    });

    const users = (await Promise.all(userPromises)).filter(Boolean);

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("getBlockedUsers error:", error);
    return res.status(500).json({ error: error.message });
  }
};