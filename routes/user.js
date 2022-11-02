// **“/user”**

// get 1 user

// put 1 user

// **“/user/messages/all”**

// get all messages (check id user connecté avec receiver\_id, sender\_id en db)

// **“/user/products/all”**

// get all products de user

// **“/users/:id/profile” pas sécu**

// get 1 user by id
// const multer=require('multer');
// const storageEngine= multer.diskStorage({
//     destination:"./pictures",
//     filename:(req,file,cb)=>{
//         cb(null,`${Date.now()}`)
//     }
// }).limits(2000000)
// const upload=multer({dest:'../pictures'});
const User = require("../middlewares/user");
const express = require("express");
const app = express();
const User = require("../models");
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");

app.get("/", passport.authenticate("jwt"), (req, res) => {
    res.json(req.user);
});

app.post(
    "/",
    body("firstName")
        .exists()
        .isLenght({ min: 2 })
        .withMessage("First name is too short"),
    body("lastName")
        .exists()
        .isLenght({ min: 2 })
        .withMessage("Last name is too short"),
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password")
        .exists()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Invalid password"),
    body("nickname")
        .exists()
        .isLenght({ min: 5 })
        .withMessage("Invalid nickname"),
    async (req, res) => {
        const { email, password, firstName, lastName, nickname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            nickname,
        });

        res.json(user);
    }
);
app.put(
    "/",
    passport.authenticate("jwt"),
    body("firstName")
        .exists()
        .isLenght({ min: 2 })
        .withMessage("First name is too short"),
    body("lastName")
        .exists()
        .isLenght({ min: 2 })
        .withMessage("Last name is too short"),
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password")
        .exists()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Invalid password"),
    body("nickname")
        .exists()
        .isLenght({ min: 5 })
        .withMessage("Invalid nickname"),
    async (req, res) => {
        const { firstName, lastName, nickname, passport, email } = req.body;
        const user = await User.update(
            {
                firstName,
                lastName,
                nickname,
                password,
                email,
            },
            {
                where: {
                    id: req.user.id,
                },
            }
        );
    }
);

module.exports = app;
