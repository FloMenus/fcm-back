const express = require("express");
const app = express();

const { User, Message, Product } = require("../models");
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");

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
    async (req, res) => {
        const { firstName, lastName, nickname, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.update(
            {
                firstName,
                lastName,
                nickname,
                password: hashedPassword,
                email,
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
app.get("/", passport.authenticate("jwt"), async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.user.id,
        },
    });
    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nickname: user.nickname,
    };
    res.json(data);
});

// get all messages (check with receiverId, senderId)
app.get("/messages/all", passport.authenticate("jwt"), async (req, res) => {
    const sendedMessages = await Message.findAll({
        where: {
            senderId: req.user.id,
        },
    });
    const receivedMessages = await Message.findAll({
        where: {
            receiverId: req.user.id,
        },
    });
    if (sendedMessages || receivedMessages) {
        res.json({ sendedMessages, receivedMessages });
    } else {
        res.status(404).json("No message found");
    }
});

// **“/user/products/all”**
// get all products de user

app.get("/products/all", passport.authenticate("jwt"), async (req, res) => {
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
});

module.exports = app;
