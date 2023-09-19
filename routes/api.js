const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/users", (req, res) => {
    const {
        name,
        username,
        password,
        isAdmin
    } = req.body;

    const newUser = new User({
        name,
        username,
        password,
        isAdmin
    });

    //add this user to the database

    newUser.save();

    res.json(newUser);
});

module.exports = router;