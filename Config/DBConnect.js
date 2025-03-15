import mongoose, { connect } from "mongoose";

// Connect to MongoDB
const DBConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Connected to MongoDB successfully On ${conn.connection.host} on ${conn.connection.name} at port ${conn.connection.port}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message} `);
    process.exit(1);
  }
};

export default DBConnect;
