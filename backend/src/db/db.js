const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const poolSize = parseInt(process.env.MONGO_POOL_SIZE || "20", 10);

  await mongoose.connect(uri, {
    // increase pool size to allow more concurrent DB connections
    maxPoolSize: poolSize,
    // fail fast if DB not available
    serverSelectionTimeoutMS: 5000,
    // socket timeout
    socketTimeoutMS: 45000,
    // recommended flags handled by mongoose defaults for current versions
  });
  console.log("MongoDB connected (poolSize=" + poolSize + ")");
};
module.exports = connectDB;
