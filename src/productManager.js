const fs = require("fs");

class ProductManager {
  id = 1;
  constructor(path) {
    this.path = path ?? "./products.json";
    this.products = [];
  }

  async save(data) {
    const content = JSON.stringify(data, null, "\t");
    try {
      await fs.promises.writeFile(this.path, content, "utf-8");
    } catch (error) {
      console.log(error);
    }
  }

  async load() {
    try {
      if (fs.existsSync(this.path)) {
        const jsonToArray = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(jsonToArray);
      }
    } catch (err) {
      console.log(err);
    }
  }

  checkRequiredFields(product) {
    const requiredFields = Object.keys(product);
    return requiredFields.every((field) => product[field] !== undefined);
  }

  async getProductIndex(id) {
    this.products = await this.load();
    const index = this.products.findIndex((product) => product.id === id);
    return index;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!this.checkRequiredFields(product)) {
      console.log("All fields are required");
      return;
    }

    if (this.checkCode(code)) {
      console.log(`The product with code ${code} already exists`);
      return;
    }
    this.products.push(product);
    await this.save(this.products);
    console.log(`Product with id ${product.id} has been added`);
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    this.products = await this.load();
    if (await this.listEmpty()) {
      console.log("The list is empty");
      return;
    }

    const index = await this.getProductIndex(id);

    if (index === -1) {
      console.log(`The product with id ${id} does not exist`);
      return;
    }

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products[index] = product;
    console.log(`Product with id ${id} has been updated`);
    await this.save(this.products);
  }

  listEmpty = async () => this.products.length === 0;

  async deleteProduct(id) {
    this.products = await this.load();

    if (await this.listEmpty()) {
      console.log("The list is empty");
      return;
    }

    const index = await this.getProductIndex(id);
    if (index === -1) {
      console.log(`The product with id ${id} does not exist`);
      return;
    }

    this.products.splice(index, 1);
    console.log(`Product with id ${id} has been deleted`);
    await this.save(this.products);
  }

  async getProducts() {
    return this.products;
  }

  getProductById(id, list) {
   
    const product = list.find((product) => product.id === id);

    if (!product) {
      return `The product with code ${id} no exists`;
    } else {
      return product;
    }
  }

  checkCode(code) {
    code = this.products.find((product) => product.code === code);
    if (code) {
      return true;
    }
  }
}

module.exports = ProductManager;
