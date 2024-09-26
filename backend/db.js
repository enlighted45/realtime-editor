import mongoose from "mongoose";
mongoose.set('strictQuery', true);

const mongoURI = "mongodb+srv://deekshadewanganbce21:5xxnFBfAlBZKcms7@codesync.ycsd5.mongodb.net";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectToMongo;
