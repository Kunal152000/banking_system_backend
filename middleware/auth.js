const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("access denied");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log(req.user);
    console.log("decoded", decoded); // Added logging for debugging
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
};
