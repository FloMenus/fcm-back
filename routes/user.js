const express = require("express");
const app = express();

require("dotenv").config();
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");
const { User, Message, Product, Image } = require("../models");

const {
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
} = require("../middlewares/user");
const multer = require("../middlewares/multer-config");

// post 1 user sign up (créer un compte)
app.post(
    "/",
    body("firstName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Invalid first name"),
    body("lastName")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Invalid last name"),
    body("email").exists().isEmail().withMessage(`Email isn't valid`),
    body("password")
        .exists()
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        )
        .withMessage("Invalid password"),
    body("nickname")
        .exists()
        .isLength({ min: 2 })
        .withMessage("Invalid nickname"),
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
    async (req, res) => {
        const errorResult = validationResult(req).array();

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            console.log(req.body);
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
    }
);

app.post("/upload", multer.single("image"), async (req, res) => {
    console.log(req.uploadError);
    if (req.uploadError) {
        res.status(400).json("Upload failed");
    } else {
        const image = await Image.create({
            userId: req.headers.userId,
            image_url: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
        });
        res.json(image);
    }
});

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
    passport.authenticate("jwt"),
    async (req, res) => {
        const errorResult = validationResult(req).array();

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            const { firstName, lastName } = req.body;
            await User.update(
                {
                    first_name: firstName,
                    last_name: lastName,
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
app.get("/products/all", passport.authenticate("jwt"), async (req, res) => {
    const products = await Product.findAll({
        where: {
            userId: req.user.id,
        },
    });
    if (products.length > 0) {
        res.json(products);
    } else {
        res.status(404).json("No product found");
    }
});

module.exports = app;
