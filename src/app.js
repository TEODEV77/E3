const express = require("express");
const ProductManager = require("./productManager");
const app = express();
const port = 8080;

const productManager = new ProductManager("./products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.load();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {}
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productManager.load();
    const result = await productManager.getProductById(parseInt(id), products);
    res.json(result);
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
