const express = require("express");
const router = express.Router();
const {
  profileData,
  addUserInLoop,
  test,
  peopleProfileData,
  swypedUser,
  likedMe,
  matched,
  editProfileData,
  updatePictures,
  blockUser,
  unblockUser,
  getBlockedUsers,
} = require("../controllers/userDetailsController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../utils/multer");

router.post("/profile", verifyToken, profileData)
router.put("/editProfile", verifyToken, editProfileData)
router.put("/updatePictures", verifyToken, upload.any(), updatePictures)
router.post("/peopleProfile", verifyToken, peopleProfileData)
router.post("/swypedUser", verifyToken, swypedUser);
router.post("/likedMe", verifyToken, likedMe);
router.post("/matched", verifyToken, matched);
router.post("/blockUser", verifyToken, blockUser);
router.post("/unblockUser", verifyToken, unblockUser);
router.post("/blockedUsers", verifyToken, getBlockedUsers);

// addUserLoop and test were unauthenticated debug/seed endpoints (bulk Firestore
// writes / raw queries with no identity check). They're intentionally not wired
// up here anymore — run them locally via a script if you still need them, don't
// expose them on the public API.

module.exports = router;
