require("dotenv").config();
const jwt = require("jsonwebtoken");

const issueToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET);

    return token;
};

module.exports = issueToken;
