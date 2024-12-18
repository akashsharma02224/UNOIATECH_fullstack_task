const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./utils/config/db/index");
const {app} = require("./app");

connectDB()
  .then(() => {
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Connection Failed !!!", err);
  });
