import UserSocketMap from "../models/Client.js";

// Create a new mapping
export const createUserSocketMap = async (socketId, userName, roomId) => {
    const userSocketMap = new UserSocketMap({ socketId, userName, roomId });
    await userSocketMap.save();
    return userSocketMap;
};

// Get all clients in a room
export const getAllConnectedClients = async (roomId) => {
    return await UserSocketMap.find({ roomId }).select("socketId userName");
};

// Delete a mapping
export const deleteUserSocketMap = async (socketId) => {
    await UserSocketMap.findOneAndDelete({ socketId });
};

// Get user details by socketId
export const getUserBySocketId = async (socketId) => {
    return await UserSocketMap.findOne({ socketId });
};