const { Server } = require("socket.io");
const { auth } = require("../config/firebaseConfig");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  // Verify the Firebase ID token sent as `socket.handshake.auth.token` before
  // allowing the connection. Without this, anyone could connect anonymously
  // and join/eavesdrop on any chat room.
  io.use(async (socket, next) => {
    try {
      const idToken = socket.handshake.auth?.token;
      if (!idToken) return next(new Error("Missing auth token"));

      const decodedToken = await auth.verifyIdToken(idToken);
      socket.data.uid = decodedToken.uid;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id, "uid:", socket.data.uid);

    // ✅ JOIN CHAT ROOM
    // chatId is the conversationId, which is always the two members' uids
    // sorted and joined with "_" (see utils/messageUtils.getConversationId).
    // Only allow a socket to join a room it's actually a member of.
    socket.on("joinChat", (chatId) => {
      if (typeof chatId !== "string" || !chatId.split("_").includes(socket.data.uid)) {
        console.warn("🚫 Rejected joinChat:", chatId, "for uid:", socket.data.uid);
        return;
      }
      socket.join(chatId);
      console.log("👥 Joined room:", chatId);
    });

    // ✅ SEND MESSAGE
    socket.on("sendMessage", async (messageData) => {
      try {
        if (!messageData?.chatId || !messageData?.text) return;
        if (!messageData.chatId.split("_").includes(socket.data.uid)) return;

        console.log("📩 Message:", messageData);

        // TODO: save in DB here if needed

        // 🔥 Emit to same chat room
        io.to(messageData.chatId).emit("newMessage", messageData);

      } catch (err) {
        console.error("Socket error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = { initSocket };
