const express = require("express");
const router = express.Router();
const { authenticateUser, socialAuth, registerUser } = require("../controllers/authController");
const upload = require("../utils/multer");
const { verifyToken } = require("../middleware/auth");

router.post("/authenticateUser", authenticateUser);
router.post("/social", socialAuth);
// registerUser writes the profile document, so it must run as the verified
// caller, not whatever uid the client puts in the form body.
router.post("/register", verifyToken, upload.array("pictures", 6), registerUser);

module.exports = router;
