import mongoose from 'mongoose';

let cachedConn = null;

export const connectToDB = async () => {
  // If the cached connection exists, return it
  if (cachedConn) {
    console.log('Using cached database connection');
    return cachedConn;
  }

  // Set mongoose configurations
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  // Check if the global connection state indicates a connection
  if (global._mongoConn && global._mongoConn.isConnected) {
    console.log('MongoDB is already connected');
    cachedConn = global._mongoConn.conn;
    return cachedConn;
  }

  try {
    // Create a new connection
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "partsoft",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Extend the server selection timeout
      socketTimeoutMS: 45000, // Extend the socket timeout
    });

    // Update global connection state
    global._mongoConn = {
      isConnected: true,
      conn: conn
    };

    // Cache the connection
    cachedConn = conn;

    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};
