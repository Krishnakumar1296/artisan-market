const mongoose = require('mongoose');

let connectionPromise;

module.exports = async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log('MongoDB connected');
        return m;
      })
      .catch((err) => {
        connectionPromise = null;
        console.error('MongoDB connection failed:', err.message);
        throw err;
      });
  }

  return connectionPromise;
};
