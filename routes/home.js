const express = require("express");
const app = express();

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "my app",
    message: "hello this is the new banking system backend",
  });
});
app.get("/resetPass", (req, res) => {
  res.render("resetPass", {
    title: "Reset Password",
    message: "Please enter your new password",
  });
});
app.get("/forgetPass", (req, res) => {
  const token = req.query.token;
  res.render("forgetPass", {
    title: "Forgot Password",
    message: "Please enter your new password",
    token: token,
  });
});
module.exports = app;
