import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  try {
    const mongoUri = `${process.env.VITE_MONGO_URI}/${process.env.VITE_MONGO_DB_NAME}`;
    if (!mongoUri) {
      throw new Error("MongoDB connection URI is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

export default connectDB;
