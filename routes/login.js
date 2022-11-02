const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const JWT = require("../utils/jwt");
const User = require("../models");

app.get(
    "/login",
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password").exists().withMessage("Fill the password"),
    async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(404).send("Not found");
        } else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = JWT({ id: user.id });
                res.json({
                    token,
                });
            } else {
                res.status(404).send("Not found");
            }
        }
    }
);

module.exports = app;
