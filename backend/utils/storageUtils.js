const { storage } = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

/**
 * Uploads a single in-memory file (as attached by multer) to Firebase Storage
 * under users/<uid>/photos/ and returns a public, Firebase-style download URL.
 * Shared by anything that needs to save a user's photo (register, edit images)
 * so the upload logic only lives in one place.
 */
const uploadUserPhoto = (uid, file) => {
  return new Promise((resolve, reject) => {
    // Strip anything from the client-supplied name that could push the object
    // outside users/<uid>/photos/.
    const safeName = String(file.originalname || "photo.jpg").replace(/[^\w.-]/g, "_");

    const fileName = `users/${uid}/photos/${uuidv4()}_${safeName}`;
    const blob = storage.file(fileName);
    const token = uuidv4();

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token, // this is the key 🔑
        },
      },
    });

    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const bucketName = storage.name;
      const encodedPath = encodeURIComponent(fileName);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

/**
 * Deletes the object behind a download URL produced by uploadUserPhoto.
 *
 * Dropping a photo from the Firestore `pictures` array doesn't remove the file
 * — the object stays in the bucket and anyone holding the old URL can still
 * fetch it. Call this for every URL that falls out of a user's gallery.
 *
 * Quietly ignores URLs that aren't ours (seed data, external links) and
 * objects that are already gone, so it's safe to call more than once.
 */
const deleteUserPhotoByUrl = async (url) => {
  const match = /\/o\/([^?]+)/.exec(url || "");
  if (!match) return;

  const fileName = decodeURIComponent(match[1]);

  // Only ever delete inside the photos folder, never an arbitrary object path.
  if (!/^users\/[^/]+\/photos\//.test(fileName)) return;

  try {
    await storage.file(fileName).delete();
  } catch (err) {
    if (err.code === 404) return; // already deleted
    throw err;
  }
};

module.exports = { uploadUserPhoto, deleteUserPhotoByUrl };