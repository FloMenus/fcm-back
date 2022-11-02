const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Image = sequelize.define("image", {
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Image;
};
