import { io } from "socket.io-client";
import { ENV } from "@utils/Constants";
import { getSocketAuthToken } from "@utils/api";

const SOCKET_URL = `${ENV.API_IP}:3000`;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // important for React Native
  autoConnect: false,        // we will connect manually
  // socket.io-client calls this fresh on every (re)connect attempt, so an
  // expired token gets refreshed automatically without extra wiring.
  auth: (cb) => {
    getSocketAuthToken()
      .then(token => cb({ token }))
      .catch(() => cb({}));
  },
});
