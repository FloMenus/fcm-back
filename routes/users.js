const express = require("express");
const app = express();
const { checkIfUserExist } = require("../middlewares/users");

app.get("/:id/profile", checkIfUserExist, async (req, res) => {
    res.json(req.user);
});

module.exports = app;
