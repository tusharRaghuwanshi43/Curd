//Imports
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;

//Database connection 
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database!"));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: "Secret key!",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//set template engine
app.set('view engine', 'ejs');

//route prefix
app.use("", require('./routes/routes'));

//Starting the server
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});