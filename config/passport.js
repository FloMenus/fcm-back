require("dotenv").config();
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

const strategy = new Strategy(options, async (payload, done) => {
    const { id } = payload;
    const user = await User.findOne({
        where: {
            id,
        },
        attributes: {
            exclude: ["password"],
        },
    });
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(strategy);

module.exports = passport;
