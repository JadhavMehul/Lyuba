const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { initSocket } = require("./socket/socket");


const app = express();
dotenv.config();

const authRoutes = require("./routes/auth");
const locationRoutes = require("./routes/location")
const userRoutes = require("./routes/userDetails")
const messageRoutes = require("./routes/message")

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/userDetails", userRoutes)
app.use("/api/message", messageRoutes)

// Anything that throws before a route can answer — multer parse failures, bad
// bodies — must still come back as JSON. The app parses every response as
// JSON, so Express's default HTML error page turns a real, nameable error
// into a misleading "check your connection" on the device.
app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || "Server error" });
});



// 🔹 Create HTTP server from express
const server = http.createServer(app);

// 🔹 Initialize Socket.io
initSocket(server);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
