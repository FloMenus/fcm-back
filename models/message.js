const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Message = sequelize.define("message", {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Message;
};
