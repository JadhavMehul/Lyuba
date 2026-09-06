import { io } from "socket.io-client";
import { ENV } from "@utils/Constants";

const SOCKET_URL = `${ENV.API_IP}:3000`;

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // important for React Native
  autoConnect: false,        // we will connect manually
});
