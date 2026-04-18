const jwt = require("jsonwebtoken");
// const config = require("../config");
const private_key = process.env.jwtPrivateKey;

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("access denied");
  try {
    const decoded = jwt.verify(token, private_key);
    req.user = decoded;
    console.log(req.user);
    console.log("decoded", decoded); // Added logging for debugging
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
};
