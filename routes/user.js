const express = require("express");
const app = express();

const { body } = require("express-validator");
const { Op } = require("sequelize");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");
const { User, Message, Product } = require("../models");

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
    body("firstName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("First name is too short"),
    body("lastName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Last name is too short"),
    body("password")
        .exists()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Invalid password"),
    passport.authenticate("jwt"),
    async (req, res) => {
        const { firstName, lastName, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update(
            {
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
            },
            {
                where: {
                    id: req.user.id,
                },
            }
        );
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
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

    async (req, res) => {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id },
                    { receiverId: req.user.id },
                ],
            },
            order: [["productId", "ASC"]],
        });
        if (messages.length > 0) {
            res.json(messages);
        } else {
            res.status(404).json("No message found");
        }
    }
);

// get all products de user

app.get(
    "/products/all",
    passport.authenticate("jwt"),
    checkIfProductExist,
    async (req, res) => {
        const products = await Product.findAll({
            where: {
                userId: req.user.id,
            },
        });
        if (products) {
            res.json(products);
        } else {
            res.status(404).json("no product found");
        }
    }
);

module.exports = app;
