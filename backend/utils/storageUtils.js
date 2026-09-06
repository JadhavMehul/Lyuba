const { storage } = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

/** A user may never hold more than this many photos, in Firestore or in the bucket. */
const MAX_PICTURES = 6;

/** Everything a user's photos live under. Nothing outside it is ever touched. */
const photosPrefix = (uid) => `users/${uid}/photos/`;

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

/** Object path behind a download URL, or null if the URL isn't one of ours. */
const objectPathFromUrl = (url) => {
  const match = /\/o\/([^?]+)/.exec(url || "");
  if (!match) return null;

  const fileName = decodeURIComponent(match[1]);

  // Only ever act inside a photos folder, never an arbitrary object path.
  return /^users\/[^/]+\/photos\//.test(fileName) ? fileName : null;
};

/** The slot a stored photo occupies, from its `photo_<n>` name (null if unnamed that way). */
const photoIndexFromUrl = (url) => {
  const path = objectPathFromUrl(url);
  const match = path && /\/photo_(\d+)\.[^./]+$/.exec(path);
  return match ? Number(match[1]) : null;
};

/**
 * Uploads a single in-memory file (as attached by multer) to Firebase Storage
 * and returns a public, Firebase-style download URL.
 *
 * The object is named after the gallery slot it fills —
 * users/<uid>/photos/photo_<index>.<ext> — so a user's folder can only ever
 * hold MAX_PICTURES objects: re-saving a slot overwrites it in place instead
 * of piling up a new file each time. `index` therefore has to be unique across
 * one save and must not collide with a slot that's being kept; callers get it
 * from allocatePhotoIndexes.
 *
 * Shared by anything that needs to save a user's photo (register, edit images)
 * so the upload logic only lives in one place.
 */
const uploadUserPhoto = (uid, file, index) => {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(index) || index < 0 || index >= MAX_PICTURES) {
      reject(new Error(`Photo index must be 0-${MAX_PICTURES - 1}, got ${index}`));
      return;
    }

    // The name is built here, never taken from the client, so an uploaded
    // filename can't steer the object outside users/<uid>/photos/.
    const ext = EXTENSIONS[file.mimetype] || "jpg";
    const fileName = `${photosPrefix(uid)}photo_${index}.${ext}`;
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
 * Picks `count` free slot indexes, avoiding the ones the kept photos already
 * sit in.
 *
 * This is what stops a new upload from landing on a photo the user is keeping:
 * if they drop their first picture and add a new one, the kept photo is still
 * photo_1.jpg, so the upload has to become photo_0.jpg and not overwrite it.
 */
const allocatePhotoIndexes = (keepUrls, count) => {
  const taken = new Set(
    (keepUrls || []).map(photoIndexFromUrl).filter((i) => i !== null)
  );

  const free = [];
  for (let i = 0; i < MAX_PICTURES && free.length < count; i++) {
    if (!taken.has(i)) free.push(i);
  }

  if (free.length < count) {
    throw new Error(`Cannot fit ${count} new photos within ${MAX_PICTURES} slots`);
  }
  return free;
};

/**
 * Deletes the object behind a download URL produced by uploadUserPhoto.
 *
 * Dropping a photo from the Firestore `pictures` array doesn't remove the file
 * — the object stays in the bucket and anyone holding the old URL can still
 * fetch it.
 *
 * Quietly ignores URLs that aren't ours (seed data, external links) and
 * objects that are already gone, so it's safe to call more than once.
 */
const deleteUserPhotoByUrl = async (url) => {
  const fileName = objectPathFromUrl(url);
  if (!fileName) return;

  try {
    await storage.file(fileName).delete();
  } catch (err) {
    if (err.code === 404) return; // already deleted
    throw err;
  }
};

/**
 * Makes users/<uid>/photos/ hold exactly the photos in `keepUrls` and nothing
 * else, deleting every other object under that prefix.
 *
 * Slot naming alone keeps a save from growing the folder, but it can't undo
 * what's already there — files written under the old `<uuid>_photo_0.jpg`
 * scheme, or left behind by a save that failed midway. This sweeps those out,
 * so after any save the user is back to at most MAX_PICTURES files.
 *
 * Only ever deletes inside this uid's own folder. Failures are reported back
 * rather than thrown: cleanup must never fail a save that already committed.
 */
const syncUserPhotos = async (uid, keepUrls) => {
  const keep = new Set(
    (keepUrls || []).map(objectPathFromUrl).filter(Boolean)
  );

  const [files] = await storage.getFiles({ prefix: photosPrefix(uid) });
  const stale = files.filter((file) => !keep.has(file.name));

  const results = await Promise.allSettled(stale.map((file) => file.delete()));

  results.forEach((result, i) => {
    // 404 just means someone else got there first.
    if (result.status === "rejected" && result.reason?.code !== 404) {
      console.error("Failed to delete stale photo", stale[i].name, result.reason);
    }
  });
};

module.exports = {
  MAX_PICTURES,
  uploadUserPhoto,
  allocatePhotoIndexes,
  deleteUserPhotoByUrl,
  syncUserPhotos,
};
