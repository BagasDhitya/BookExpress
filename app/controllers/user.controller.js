const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.user;

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const data = {
      username: username,
      email: email,
      password: await bcrypt.hash(password, 10),
    };
    const user = await User.create(data);

    if (user) {
      let token = jwt.sign({ id: user.id }, `${process.env.PrivateKey}`, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      res.status(201).send(user);
      return;
    } else {
      res.status(409).send({ message: "Details Not Correct" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find a user by their email
    const user = await User.findOne({ email: email });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, `${process.env.PrivateKey}`, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        //send user data
        res.status(201).send(user);
        return;
      } else {
        res.status(201).send(user);
        return;
      }
    } else {
      res.status(201).send(user);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
};
