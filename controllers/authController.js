const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const Post = require("../models/Post");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");

const validateSignup = [
    body("firstName", "first name cannot be empty")
    .trim()
    .not()
    .isEmpty(),
body("lastName", "last name cannot be empty")
    .trim()
    .not()
    .isEmpty(),
body("username", "username cannot be empty")
    .trim()
    .not()
    .isEmpty(),
body("password", "password cannot be empty")
    .trim()
    .not()
    .isEmpty(),
body("passwordConfirm", "passwords do not match")
    .custom((value, { req }) => {
        return value === req.body.password;
    })
];


const signup_post = async (req, res) => {
    const { 
        firstName,
        lastName,
        username,
        password,
        
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    
    //WE WANT TO HASH THE USERS PASSWORD FIRST, THEN SAVE IT TO THE DATABASE.

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: `${firstName} ${lastName}`,
            username,
            password: hashedPassword,
            isAdmin: false
        });

        await newUser.save();

        res.status(200).json(newUser);

    } catch(err) {
        res.status(400).json({ errorMessage: err });
    }
}

const signinAuthStrategy = new LocalStrategy( 
    async(username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
    
            if (!user) {
                return done(null, false, { message: "User not found"});
            }
    
            const match = await bcrypt.compare(password, user.password);
    
            if (!match) {
                return done(null, false, { message: "Wrong password" });
            }
    
            return done(null, user, { message: "Logged in successfully" });
    
        } catch(error) {
            return done(error);
        }
    }
)

module.exports = {
    validateSignup,
    signup_post,
    signinAuthStrategy
}

