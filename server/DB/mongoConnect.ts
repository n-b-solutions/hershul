import mongoose from 'mongoose';

async function connectDB(): Promise<void> { 
  try {
    await mongoose.connect(`${process.env.VITE_MONGO_URI}/${process.env.VITE_MONGO_DB_NAME}` as string);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

connectDB().catch(err => console.log(err));

export default connectDB;
