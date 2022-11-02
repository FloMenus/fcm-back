const express = require("express");
const app = express();
const passport = require("../config/passport");
const { Product } = require("../models/index");
const { Message } = require("../models/message");
const {
    checkIfIdExist,
    checkIfAlreadyExist,
} = require("../middlewares/product");

// get all products
app.get("/all", passport.authenticate("jwt"), async (req, res) => {
    const products = await Product.findAll();
    if (!products) {
        return res.status(404).json({
            ok: false,
            message: "No products found",
        });
    } else {
        return res.json(products);
    }
});

// post 1 product
app.post(
    "/all",
    body("title")
        .exists()
        .isLength({ min: 3 })
        .withMessage("Title is required"),
    body("description")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Description is required"),
    body("price").exists().isInt().withMessage("Price is required"),
    async (req, res) => {
        const product = await Product.create(req.body);
        res.json(product);
    }
);

// get 1 product by id
app.get(
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
    async (req, res) => {
        const { id } = req.params;
        const product = await Product.findOne({
            where: {
                id,
            },
        });
        res.json(product);
    }
);

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
    async (req, res) => {
        const { id } = req.params;
        const product = await Product.update(req.body, {
            where: {
                id,
            },
        });
        res.json(product);
    }
);

// post message on product by id
app.post(
    "/:id/message",
    passport.authenticate("jwt"),
    body("content")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Content is required"),
    async (req, res) => {
        const { content } = req.body;
        const product = Product.findOne({
            where: {
                id: req.params.id,
            },
        });
        const message = await Message.create({
            content,
            senderId: req.user.id,
            receiverId: product.userId,
            productId: req.params.id,
        });
        res.json(message);
    }
);

module.exports = app;
