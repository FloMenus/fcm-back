const express = require("express");
const app = express();
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");
const multer = require("../middlewares/multer-config");

const { Product, Message, Image } = require("../models");

const { checkIfProductExist } = require("../middlewares/product");
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
        const errorResult = validationResult(req).array();

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            const { title, description, price } = req.body;
            const product = await Product.create({
                title,
                description,
                price,
                userId: req.user.id,
            });
            res.json(product);
        }
    }
);

app.post(
    "/:id/upload",
    passport.authenticate("jwt"),
    multer.array("images", 5),
    async (req, res) => {
        const errorResult = multer.MulterError;
        if (errorResult) {
            res.status(400).json("Upload failed");
        } else {
            console.log(req.file);
            const image = await Image.create({
                productId: req.headers.productId,
                image_url: `${process.env.BACKEND_SERVER}/${req.file.filename}`,
            });
            res.json(image);
        }
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
        const errorResult = validationResult(req).array();

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            const { id } = req.params;
            const product = await Product.findOne({
                where: {
                    id,
                },
            });

            if (product) {
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
                    res.status(403).json(
                        "You are not allowed to modify this product"
                    );
                }
            } else {
                res.status(404).json("Product not found");
            }
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
        const errorResult = validationResult(req).array();

        if (errorResult.length > 0) {
            res.status(400).json(errorResult);
        } else {
            const { content } = req.body;
            const message = await Message.create({
                content,
                senderId: req.user.id,
                receiverId: req.product.userId,
                productId: +req.params.id,
            });
            res.json(message);
        }
    }
);

module.exports = app;
