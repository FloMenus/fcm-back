require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const productsRoutes = require("./routes/products");
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");

require("./models");

app.use(express.json());
app.use(cors());

app.use("/messages", messagesRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
