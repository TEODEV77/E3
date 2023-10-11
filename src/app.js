const express = require("express");
const ProductManager = require("./productManager");
const app = express();
const port = 8080;

const productManager = new ProductManager("./products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  try {
    let products = await productManager.load();
    if (limit) {
      products = products.slice(0, limit);
      res.json(products);
    } else {
      res.json(products);
    }
  } catch (error) {}
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let products = await productManager.load();
    let result = productManager.getProductById(parseInt(id), products);
    res.json(result);
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});