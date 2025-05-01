const mongoose = require("mongoose");
const config = require("config");

function createDB() {
  mongoose
    .connect(config.get("dbCreds"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("connection established");
    })
    .catch((err) => console.error("failed", err));
}

module.exports = { createDB };
