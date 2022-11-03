const { Product } = require("../models");

// check if product exist
const checkIfProductExist = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOne({
        where: {
            id,
        },
    });
    if (!product) {
        res.status(404).json("Product not found");
    } else {
        req.product = product;
        next();
    }
};

module.exports = { checkIfProductExist };
