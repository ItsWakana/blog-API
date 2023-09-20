const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const {
    validateSignup,
    signup_post
} = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/users", async (req, res) => {
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

    try {
        await newUser.save();
    
        res.json(newUser);
    } catch(err) {
        res.json({errorMessage: err});
    }
});

router.get("/users", verifyToken, async (req, res) => {

    try {
        const authData = jwt.verify(req.token, process.env.TOKEN_SECRET);
        const foundUsers = await User.find();
        if (foundUsers.length === 0) {
            return res.sendStatus(404).json({ message: "No users found" });
        }
        res.json(foundUsers);
    } catch(err) {
        res.sendStatus(403).json({ errorMessage: err });
    }
});

// GETTING ALL POSTS

router.get("/posts", async (req, res) => {

    try {
        const foundPosts = await Post.find();

    } catch(err) {
        res.sendStatus(404).json({ errorMessage: err });
    }
});

router.post("/sign-up", validateSignup, signup_post);

router.post("/sign-in", passport.authenticate("local", { session: false }), async (req, res) => {
    const { user } = req;
    
    try {
        const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '120' });
        res.json({ token });
    } catch(err) {
        res.sendStatus(403).json({ errorMessage: err });
    }

})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(' ')[1];

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}


module.exports = router;