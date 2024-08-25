import mongoose from 'mongoose';
// const DB_CONNECT=import.meta.env.DB_LOCAL
async function connectDB(): Promise<void> { 
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/hershul');
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
