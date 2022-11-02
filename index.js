require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");

require("./models");

app.use(express.json());
app.use(cors());

// app.use("/categories", categoriesRoutes);
// app.use("/products", productsRoutes);
// app.use("/orders", ordersRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
