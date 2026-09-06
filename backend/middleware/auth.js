const { auth } = require("../config/firebaseConfig");

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <idToken>`.
 * On success, attaches the decoded token to `req.user` (req.user.uid is the
 * caller's real, verified identity) and calls next().
 *
 * Every route that acts on behalf of a user MUST use this middleware and
 * MUST use req.user.uid as the identity — never a userId/uid taken from
 * req.body, since that can be forged by the client.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, idToken] = authHeader.split(" ");

  if (scheme !== "Bearer" || !idToken) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    req.user = await auth.verifyIdToken(idToken);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
