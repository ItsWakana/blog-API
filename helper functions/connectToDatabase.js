const mongoose = require("mongoose");
require("dotenv").config();


const runDatabaseConnection = (databaseName) => {
    const mongoDb = `mongodb+srv://admin:${process.env.MONGO_DB_PASSWORD}@cluster0.jqqmhiw.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

    mongoose.connect(mongoDb);

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "mongo connection error"));
}

module.exports = runDatabaseConnection;