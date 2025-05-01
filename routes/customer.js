const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Customer = require("../models/customer");
const { User } = require("../models/user");
const { Bank } = require("../models/bank");

router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user && req.user.isAdmin === false)
    return res.status(403).send("invalid user");

  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //   to check if the user already exists with the same  email
  let validUser = await Customer.findOne({ email: req.body.email });
  if (validUser) return res.status(400).send("user already exists");

  const bank = await Bank.findOne({
    code: req.body.code,
    "user._id": req.user._id,
  });
  if (!bank) return res.status(400).send("bank is not valid");

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password,
    bank: {
      _id: bank._id,
      name: bank.name,
      code: req.body.code,
    },
    user: {
      _id: user._id,
      name: user.name,
    },
  });
  try {
    const result = await customer.save();
    res
      .status(200)
      .send(
        _.pick(result, [
          "_id",
          "name",
          "email",
          "bankBalance",
          "bank.name",
          "user.name",
        ])
      );
  } catch (err) {
    res.send(err.message);
  }
});

function validateUser(customer) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    age: Joi.number().integer().min(18).max(150).required(),
    password: Joi.string().min(5).max(255).required(),
    code: Joi.number().integer().required(),
    // bankId: Joi.string().required(),
    // userId: Joi.string().required(),
  };
  return Joi.validate(customer, schema);
}

module.exports = router;
