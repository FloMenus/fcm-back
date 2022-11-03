const express = require("express");
const app = express();

const { body } = require("express-validator");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const {
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
    checkIfUserExist,
    checkIfReceivedMessageExist,
    checkIfSendedMessageExist,
    checkIfProductExist,
} = require("../middlewares/user");

// const multer=require('multer');
// const storageEngine= multer.diskStorage({
//     destination:"./pictures",
//     filename:(req,file,cb)=>{
//         cb(null,`${Date.now()}`)
//     }
// }).limits(2000000)
// const upload=multer({dest:'../pictures'});

// post 1 user sign up (créer un compte)
app.post(
    "/",
    body("firstName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("First name is too short"),
    body("lastName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Last name is too short"),
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password")
        .exists()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Invalid password"),
    body("nickname")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Invalid nickname"),
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
    async (req, res) => {
        const { firstName, lastName, email, nickname, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            nickname,
            password: hashedPassword,
        });
        res.json(user);
    }
);

// put 1 user
app.put(
    "/",
    passport.authenticate("jwt"),
    body("firstName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("First name is too short"),
    body("lastName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Last name is too short"),
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password")
        .exists()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Invalid password"),
    body("nickname")
        .exists()
        .isLength({ min: 5 })
        .withMessage("Invalid nickname"),
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
    async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.user.password, 10);
        const user = await User.update(
            {
                ...req.user,
                password: hashedPassword,
            },
            {
                where: {
                    id: req.user.id,
                },
            }
        );
        res.json(user);
    }
);

// get 1 user
app.get("/", passport.authenticate("jwt"), (req, res) => {
    res.json(req.user);
});

// get all messages (check with receiverId, senderId)
app.get(
    "/messages/all",
    passport.authenticate("jwt"),

    (req, res) => {
        res.json(req.messages);
    }
);

// get all products de user

app.get(
    "/products/all",
    passport.authenticate("jwt"),
    checkIfProductExist,
    (req, res) => {
        res.json(req.products);
    }
);

module.exports = app;
