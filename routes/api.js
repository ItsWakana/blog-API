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
        const foundUsers = await User.find();
        if (foundUsers.length === 0) {
            res.sendStatus(404).json({message: "No users found"});
        } else {
            res.json(foundUsers);
        }
    } catch(err) {
        res.sendStatus(404).json({errorMessage: err});
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

        jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
            if (err) {
                return res.sendStatus(400).json({ errorMessage: err });
            }

            res.json({ token });
        });
})

function verifyToken(req, res, next) {
    res.json(req.headers);
    const bearerHeader = req.headers["authorization"];


    if (typeof bearerHeader !== "undefined") {

    } else {
        res.sendStatus(403);
    }
}


module.exports = router;