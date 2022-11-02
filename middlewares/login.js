const User = require("../models");
const JWT = require("../utils/jwt");
const bcrypt = require("bcrypt");

const checkIfUserExist = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email,
        },
    });
    if (!user) {
        res.status(404).send("Not found");
    } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            req.token = JWT({ id: user.id });
            next();
        } else {
            res.status(401).send("Wrong Password");
        }
    }
};

module.exports = { checkIfUserExist };
