const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/googlebooks"
);

module.exports = mongoose.connection;
