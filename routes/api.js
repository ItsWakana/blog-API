const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
const {
    validateSignup,
    signup_post,
    authMe_post
} = require("../controllers/authController");
const { 
    blogPost_post, 
    blogPostComment_post,
    validateBlogPost,
    validateBlogPostComment
} = require("../controllers/postController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

router.use(cors(corsOptions));

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
            return res.status(404).json({ message: "No users found" });
        }
        res.json(foundUsers);
    } catch(err) {
        res.status(403).json({ errorMessage: err });
    }
});

// GETTING ALL POSTS

router.get("/posts", async (req, res) => {

    try {
        const foundPosts = await Post.find().populate("comments");

        res.json(foundPosts);
    } catch(err) {
        res.status(404).json({ errorMessage: err });
    }
});

router.get("/posts/:postId", async (req, res) => {

    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ errorMessage: "Invalid ID" });
    }

    try {
        const foundBlogPost = await Post.findById(postId)
            .populate({
                path: "comments",
                populate: {
                path: "author", 
                model: "User"
                },
            })
        .exec();

        res.json(foundBlogPost);
    } catch(error) {
        res.status(404).json({ errorMessage: error });
    }
});

router.put("/posts/:postId", verifyToken, async (req, res) => {

    const { postId } = req.params;

    const {
        title,
        content,
        isPublished
    } = req.body;

    if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({ errorMessage: "Invalid ID" });
    }

    try {

        await Post.findOneAndUpdate({_id: postId}, {title, content, published: { isPublished }});
        res.json(req.body);
    } catch(error) {
        res.status(404).json({ errorMessage: error });
    }


})


router.post("/posts", verifyToken, validateBlogPost, blogPost_post);

router.post("/posts/:postId/comments", verifyToken, validateBlogPostComment, blogPostComment_post);

router.post("/sign-up", validateSignup, signup_post);

router.post("/sign-in", passport.authenticate("local", { session: false }), async (req, res) => {
    const { user } = req;

    try {
        const token = jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: '15m' });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     path: '/',
        //     expires: new Date(Date.now() + 10 * 60 * 1000)
        // });
        res.json({ token });
    } catch(err) {
        res.status(403).json({ errorMessage: err });
    }
});

router.post("/sign-out", (req, res) => {
    res.clearCookie("token", {
        path: "/"
    });
});

router.post("/me", verifyToken, authMe_post);


function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const token = bearerHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, token) => {
            if (err) return res.status(403).json({ errorMessage: err });
            req.user = token;
            next();
        });
    } else {
        res.status(403).json({errorMessage: "Invalid authorization"});
    }

    // const token = req.cookies.token;

    // if (token) {
    //     jwt.verify(token, process.env.TOKEN_SECRET, (err, token) => {
    //         if (err) return res.status(403).json({ errorMessage: err });
    //         req.user = token;
    //         next();
    //     });
    // } else {
    //     res.sendStats(403);
    // }
}


module.exports = router;