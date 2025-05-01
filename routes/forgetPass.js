const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const Customer = require("../models/customer");
// You can use nodemailer for sending emails
const nodemailer = require("nodemailer");

router.post("/forgot-password", async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Customer.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User with this email does not exist");

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"), {
    expiresIn: "15m",
  });

  // Send email (simple setup using nodemailer, configure with your service)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred service
    auth: {
      user: config.get("email"),
      pass: config.get("emailPassword"),
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: `"Backend Banking App" <${config.get("email")}>`,
    to: user.email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Password reset link sent to email.");
  } catch (err) {
    res.status(500).send("Failed to send email. Try again later.");
  }
});

function validateEmail(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(body);
}

module.exports = router;
