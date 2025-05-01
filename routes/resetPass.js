const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Customer = require("../models/customer");

router.post("/reset-password", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let payload;
  try {
    payload = jwt.verify(req.body.token, config.get("jwtPrivateKey"));
  } catch (err) {
    return res.status(400).send("Invalid or expired token");
  }

  const user = await Customer.findById(payload._id);
  if (!user) return res.status(404).send("User not found");

  const samePassword = await bcrypt.compare(req.body.password, user.password);
  if (samePassword)
    return res
      .status(400)
      .send("You cannot reuse your previous password");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();

  res.status(200).send("Password has been reset successfully.");
});

function validate(req) {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(req);
}

module.exports = router;
