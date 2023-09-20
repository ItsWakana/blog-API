const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signinAuthStrategy } = require("../controllers/authController");

passport.use(signinAuthStrategy);

module.exports = passport;