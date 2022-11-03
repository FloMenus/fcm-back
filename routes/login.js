const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");

const { User } = require("../models");
const JWT = require("../utils/jwt");
const bcrypt = require("bcrypt");

app.post(
    "/",
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password").exists().withMessage("Password is required"),
    async (req, res) => {
        const errorResult = validationResult(req);

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({
                where: {
                    email,
                },
            });
            if (!user) {
                res.status(404).send("Not found");
            } else {
                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (validPassword) {
                    const token = JWT({ id: user.id });
                    res.json({ token });
                } else {
                    res.status(401).send("Wrong Password");
                }
            }
        }
    }
);

module.exports = app;
