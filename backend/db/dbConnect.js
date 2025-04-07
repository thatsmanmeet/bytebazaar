import mongoose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `✅ MONGODB CONNECTION SUCCESSFUL. HOST:${conn.connection.host}`.green
    );
  } catch (error) {
    console.log(`❌ MONGODB CONNECTION ERROR: ${error}`.red);
    process.exit(1);
  }
};
