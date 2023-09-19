const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

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

    const newUser = {
        fullName: firstName + ' ' + lastName,
        username,
        password
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return res.status(200).json(newUser);
    }

    res.status(422).json({errors: errors.array()});
}

module.exports = {
    validateSignup,
    signup_post
}

