const { firestore, FieldValue } = require("../config/firebaseConfig");
const { getConversationId } = require("../utils/messageUtils");


exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.uid; // never trust a client-supplied senderId
    const { receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Don't allow messages between users who've blocked each other.
    const [senderDoc, receiverDoc] = await Promise.all([
      firestore.collection("users").doc(senderId).get(),
      firestore.collection("users").doc(receiverId).get(),
    ]);
    const senderBlocked = senderDoc.data()?.blockedUsers || [];
    const receiverBlocked = receiverDoc.data()?.blockedUsers || [];
    if (senderBlocked.includes(receiverId) || receiverBlocked.includes(senderId)) {
      return res.status(403).json({ message: "You can't message this user" });
    }

    const conversationId = await getConversationId(senderId, receiverId);
    const convoRef = firestore.collection("conversations").doc(conversationId);

    // Create or update conversation
    await convoRef.set(
      {
        members: [senderId, receiverId],
        lastMessage: text,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    // Add message
    await convoRef.collection("messages").add({
      senderId,
      receiverId,
      text,
      createdAt: FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MESSAGES BETWEEN TWO USERS
 * GET /messages?userA=A&userB=B
 */
exports.getMessages = async (req, res) => {
  try {
    const { userA, userB } = req.body;

    if (!userA || !userB) {
      return res.status(400).json({ message: "Missing users" });
    }

    // You can only read a conversation you're actually a member of.
    if (req.user.uid !== userA && req.user.uid !== userB) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const conversationId = await getConversationId(userA, userB);

    const snapshot = await firestore
      .collection("conversations")
      .doc(conversationId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(messages);

  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

/**
 * GET CHAT LIST (INBOX)
 * GET /chats?userId=A
 */
exports.getChats = async (req, res) => {
  try {
    const userId = req.user.uid; // always your own inbox, never someone else's

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const snapshot = await firestore
      .collection("conversations")
      .where("members", "array-contains", userId)
      .orderBy("updatedAt", "desc")
      .get();

    const chats = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        const otherUserId = data.members.find((id) => id !== userId);

        // 👤 fetch other user's profile (once — was being fetched twice before)
        const userDoc = await firestore.collection("users").doc(otherUserId).get();
        const otherUserData = userDoc.data() || {};

        // 🔴 unread messages count
        const unreadSnap = await firestore
          .collection("conversations")
          .doc(doc.id)
          .collection("messages")
          .where("receiverId", "==", userId)
          .where("read", "==", false)
          .get();

        return {
          conversationId: doc.id,
          otherUserId,
          // A user with no name yet or no photos uploaded yet shouldn't crash the inbox.
          name: `${otherUserData.firstName || ""} ${otherUserData.lastName || ""}`.trim(),
          profileImage: otherUserData.pictures?.[0] || "",
          lastMessage: data.lastMessage || "",
          updatedAt: data.updatedAt || null,
          unreadCount: unreadSnap.size,
        };
      })
    );

    res.status(200).json(chats);
  } catch (error) {
    console.error("getChats error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};
