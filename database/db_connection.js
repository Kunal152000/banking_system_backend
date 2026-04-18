const mongoose = require("mongoose");
// const config = require("config");
const DB_CREDS = process.env.DB_CREDS;

function createDB() {
  console.log(DB_CREDS);
  mongoose
    .connect(DB_CREDS, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("connection established");
    })
    .catch((err) => console.error("Failed to connect to mongodb", err));
}

module.exports = { createDB };
