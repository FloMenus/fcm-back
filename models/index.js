require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false,
    }
);

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established.");
    } catch (error) {
        console.error("Unable to connect to the database:" + error);
    }
};

connectDb();

const Product = require("./product")(sequelize);
const Image = require("./image")(sequelize);
const Message = require("./message")(sequelize);
const User = require("./user")(sequelize);

Message.belongsTo(Product);
Message.belongsTo(User, { as: "sender" });
Message.belongsTo(User, { as: "receiver" });
Product.belongsTo(User);
Image.belongsTo(Product);
Image.belongsTo(User);

User.hasMany(Product);
User.hasOne(Image);
Product.hasMany(Image);
Product.hasMany(Message);

sequelize.sync({ alter: true });

const db = {
    sequelize,
    Product,
    User,
    Image,
    Message,
};

module.exports = db;
