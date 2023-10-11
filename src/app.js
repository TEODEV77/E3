const express = require("express");
const ProductManager = require("./productManager");
const app = express();
const port = 8080;

const productManager = new ProductManager("./products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  let products = await productManager.load();
  console.log(products);
  res.json(products);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
