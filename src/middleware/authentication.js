const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Validate the user and find him/her in the database
const authenticate = async (req, res, next) => {
  try {
    // remove Bearer keyword from token
    const token = req.header("Authorization").replace("Bearer ", "");

    // if token is OK, verify will return decoded payload, else throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by id who has the provided authentication token still saved, i.e he/she has not logged out
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).send({ message: "Please authenticate" });
  }
};

module.exports = authenticate;
