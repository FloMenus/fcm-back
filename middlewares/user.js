const { User, Product } = require("../models");

const checkIfEmailAlreadyExist = async (req, res, next) => {
    const { email } = req.body;
    const requestedEmail = await User.findOne({
        where: {
            email,
        },
    });
    if (!requestedEmail) {
        next();
    } else {
        res.status(409).json("Email already exist");
    }
};

const checkIfNicknameAlreadyExist = async (req, res, next) => {
    const requestedNickname = await User.findOne({
        where: {
            nickname: req.body.nickname,
        },
    });
    if (!requestedNickname) {
        next();
    } else {
        res.status(409).json("Nickname already exist");
    }
};

module.exports = {
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
};
