const express = require("express");
const runDatabaseConnection = require("./helper functions/connectToDatabase");
const apiRouter = require("./routes/api");
const passport = require("./helper functions/passport-config");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(passport.initialize());

app.listen(3000, console.log("Listening on port 3000"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", apiRouter);

runDatabaseConnection("my_blog");

