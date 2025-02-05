const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.URL)
    .then(console.log("Database Connection successfull"))
    .catch((err) => {
      console.log("Error in database connection");
      console.error(err);
      process.exit(1);
    });
};

module.exports = dbConnect;
