import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    socketId: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    roomId: { type: String, required: true },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
