const express = require("express");
const db = require("../models");

const User = db.user;

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (username) {
      return res.json(409).send({ error: "Username already taken" });
    }

    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailCheck) {
      return res.json(409).send({ error: "Email already taken" });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveUser,
};
