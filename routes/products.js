const express = require("express")
const app = express()

const { Product } = require("../models/index")
const {
  checkIfIdExist,
  checkIfAlreadyExist,
} = require("../middlewares/product")

// get all products
app.get("/", async (req, res) => {
  const products = await Product.findAll()
  res.json(products)
})

// // get one product /:id
// app.get("/:id", checkIfIdExist, async (req, res) => {
//   const { id } = req.params
//   const product = await Product.findOne({
//     where: { id },
//   })
//   res.json(product)
// })

// // create an product
// app.post("/", checkIfAlreadyExist, async (req, res) => {
//   const product = await Product.create(req.body)
//   res.json(product)
// })

// // modify product /:id
// app.put("/:id", checkIfIdExist, async (req, res) => {
//   const { id } = req.params
//   const product = await Product.update(req.body, {
//     where: { id },
//   })
//   res.json(product)
// })

// // delete product /:id
// app.delete("/:id", checkIfIdExist, async (req, res) => {
//   const { id } = req.params
//   const product = await Product.destroy({
//     where: { id },
//   })
//   res.json(product)
// })

module.exports = app