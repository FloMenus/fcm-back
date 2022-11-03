const express = require("express");
const app = express();
const passport = require("../config/passport");
const { body } = require("express-validator");
const { Op } = require("sequelize");

const { Product, Message } = require("../models");

const {
    checkIfProductExist,
    checkIfProductAlreadyExist,
} = require("../middlewares/product");
const user = require("../models/user");

// get all products
app.get("/all", async (req, res) => {
    const products = await Product.findAll();
    if (!products) {
        res.status(404).json("No products found");
    } else {
        res.json(products);
    }
});

// post 1 product
app.post(
    "/",
    body("title")
        .exists()
        .isLength({ min: 3 })
        .withMessage("Title is required"),
    body("description")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Description is required"),
    body("price").exists().isInt().withMessage("Price is required"),
    passport.authenticate("jwt"),
    async (req, res) => {
        const { title, description, price } = req.body;
        const product = await Product.create({
            title,
            description,
            price,
            userId: req.user.id,
        });
        res.json(product);
    }
);

// get 1 product by id
app.get("/:id", checkIfProductExist, async (req, res) => {
    res.json(req.product);
});

// put 1 product by id
app.put(
    "/:id",
    body("title")
        .exists()
        .isLength({ min: 3 })
        .withMessage("Title is required"),
    body("description")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Description is required"),
    body("price").exists().isInt().withMessage("Price is required"),
    passport.authenticate("jwt"),
    async (req, res) => {
        const { id } = req.params;
        const product = await Product.findOne({
            where: {
                id,
            },
        });

        if (product.userId === req.user.id) {
            const { title, description, price } = req.body;
            const newProductData = { title, description, price };
            await Product.update(newProductData, {
                where: {
                    id,
                },
            });
            const product = await Product.findOne({
                where: {
                    id,
                },
            });
            res.json(product);
        } else {
            res.status(403).json("You are allowed to modify this product");
        }
    }
);

// post message on product by id
app.post(
    "/:id/message",
    body("content")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Content is required"),
    passport.authenticate("jwt"),
    checkIfProductExist,
    async (req, res) => {
        const { content } = req.body;
        const message = await Message.create({
            content,
            senderId: req.user.id,
            receiverId: req.product.userId,
            productId: +req.params.id,
        });
        res.json(message);
    }
);

module.exports = app;
