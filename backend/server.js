import express from "express";
import http from "http";
import { Server } from "socket.io";
import process from "process";
import ACTIONS from "./Actions.js";
import connectToMongo from "./db.js";
import cors from "cors";
import {
  createUserSocketMap,
  getAllConnectedClients,
  deleteUserSocketMap,
  getUserBySocketId,
} from "./services/userSocketMapService.js";
import path from "path";

connectToMongo();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.static("../dist"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, async ({ roomId, userName }) => {
    await createUserSocketMap(socket.id, userName, roomId);
    socket.join(roomId);
    const clients = await getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    const user = await getUserBySocketId(socket.id);
    if (user) {
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          userName: user.userName,
        });
      });
      await deleteUserSocketMap(socket.id);
      socket.leave();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
