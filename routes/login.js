const express = require("express");
const app = express();
const { body } = require("express-validator");

app.get(
    "/login",
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password").exists().withMessage("Password is required"),
    (req, res) => {
        res.json({ ...req.token });
    }
);

module.exports = app;
