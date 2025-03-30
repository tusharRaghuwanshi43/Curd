const express = require("express");
const router = express.Router();
const User = require("../modules/users");


// Inserting the data of user into database (mongoDB)
router.post("/add", async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            id: req.body.id, // Ensure this field is provided
            age: req.body.age,
            salary: req.body.salary,
            joining_date: req.body.joining_date,
        });

        // Use async/await to save the user
        await user.save();

        req.session.message = {
            type: "success",
            message: "User data is successfully added in the database!",
        };
        res.redirect("/"); // Use res.redirect instead of res.render for redirection
    } catch (err) {
        req.session.message = {
            type: "danger",
            message: err.message,
        };
        res.redirect("/"); // Redirect back or to an error page if needed
    }
});

//Fetching the data from the database to the home page
router.get("/", async (req, res) => {
    try {
        // Await the result of the User.find() query
        const users = await User.find().exec();

        // Render the response with the retrieved users
        res.render("index", {
            title: "Home Page",
            users: users,
        });
    } catch (err) {
        // Handle errors by sending a JSON response with the error message
        res.json({ message: err.message });
    }
});

//Home page
router.get("/", (req, res) => {
    res.render("index", { title: " Home Page" });
});

//Add users page
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

//Update users details page
router.get("/edit/:id", async (req, res) => {
    let id = req.params.id;

    try {
        const user = await User.findById(id);

        if (user == null) {
            res.redirect("/");
        } else {
            res.render("edit_users", {
                title: "Edit Users",
                user: user,
            });
        }
    } catch (err) {
        res.redirect("/");
    }
});

//Updating the details from the database
router.post("/update/:id", async (req, res) => {
    let id = req.params.id;
    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            id: req.body.id, // Ensure this field is provided
            age: req.body.age,
            salary: req.body.salary,
            joining_date: req.body.joining_date,
        });

        req.session.message = {
            type: "success",
            message: "User data is updated successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

//Viewing details of the user
router.get('/view/:id', async (req, res) => {
    try {
        const view = await User.findById(req.params.id);
        if (!view) {
            return res.status(404).send("Employee not found");
        }
        res.render("view_user", { title: "Employee Details", view });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching the employee details.");
    }
});

//Removing the user data from the database
router.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await User.findByIdAndDelete(id);
        req.session.message = {
            type: "success",
            message: "User deleted successfully from the database!!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message });
    }
});

module.exports = router;
