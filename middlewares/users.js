const { User } = require("../models");

// check if user exist
const checkIfUserExist = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOne({
        where: {
            id,
        },
    });
    if (!user) {
        res.status(404).json("User not found");
    } else {
        req.profile = user;
        next();
    }
};

module.exports = { checkIfUserExist };
