const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Product = sequelize.define("product", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Product;
};
