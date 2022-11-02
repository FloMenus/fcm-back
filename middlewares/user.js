const { User, Message, Product } = require("../models");

const checkIfEmailAlreadyExist = async (req, res, next) => {
    const { email, password, firstName, lastName, nickname } = req.body;
    const requestedEmail = await User.findOne({
        where: {
            email,
        },
    });
    if (!requestedEmail) {
        req.user = { email, password, firstName, lastName, nickname };
        next();
    } else {
        res.status(409).json("Email already exist");
    }
};

const checkIfNicknameAlreadyExist = async (req, res, next) => {
    const requestedNickname = await User.findOne({
        where: {
            nickname: req.user.nickname,
        },
    });
    if (!requestedNickname) {
        next();
    } else {
        res.status(409).json("Nickname already exist");
    }
};

const checkIfUserExist = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            id: req.user.id,
        },
    });
    if (user) {
        req.data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            nickname: user.nickname,
        };
        next();
    } else {
        res.status(404).json("User not found");
    }
};

const checkIfSendedMessageExist = async (req, res, next) => {
    const sendedMessages = await Message.findAll({
        where: {
            senderId: req.user.id,
        },
    });
    if (sendedMessages) {
        req.sendedMessages = sendedMessages;
        next();
    } else {
        next();
    }
};

const checkIfReceivedMessageExist = async (req, res, next) => {
    const receivedMessages = await Message.findAll({
        where: {
            receiverId: req.user.id,
        },
    });
    if (receivedMessages) {
        if (req.sendedMessages) {
            req.messages = {
                sendedMessages: req.sendedMessages,
                receivedMessages,
            };
            next();
        }
        req.messages = { receivedMessages };
        next();
    } else {
        if (!req.sendedMessages) {
            res.status(404).json("Message not found");
        }
        req.messages = { sendedMessages: req.sendedMessages };
        next();
    }
};

const checkIfProductExist = async (req, res, next) => {
    const products = await Product.findAll({
        where: {
            userId: req.user.id,
        },
    });
    if (products) {
        req.products = products;
        next();
    } else {
        res.status(404).json("no product found");
    }
};

module.exports = {
    checkIfEmailAlreadyExist,
    checkIfNicknameAlreadyExist,
    checkIfUserExist,
    checkIfReceivedMessageExist,
    checkIfSendedMessageExist,
    checkIfProductExist,
};
