const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const {
    validateSignup,
    signup_post
} = require("../controllers/authController");
const { blogPost_post, validateBlogPost } = require("../controllers/postController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

router.use(cors());

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
            res.status(404).json({ message: "No users found" });
        }
        res.json(foundUsers);
    } catch(err) {
        res.status(403).json({ errorMessage: err });
    }
});

// GETTING ALL POSTS

router.get("/posts", async (req, res) => {

    try {
        const foundPosts = await Post.find();

        res.json(foundPosts);
    } catch(err) {
        res.status(404).json({ errorMessage: err });
    }
});

router.post("/posts", verifyToken, validateBlogPost, blogPost_post);

router.post("/sign-up", validateSignup, signup_post);

router.post("/sign-in", passport.authenticate("local", { session: false }), async (req, res) => {
    const { user } = req;

    try {
        const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch(err) {
        res.status(403).json({ errorMessage: err });
    }

})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, token) => {
            if (err) return res.status(403).json({ errorMessage: err });
            req.user = token;
        })
        next();
    } else {
        res.sendStatus(403);
    }
}


module.exports = router;