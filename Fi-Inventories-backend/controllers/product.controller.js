const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.user.id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await productService.addProduct(req.body, req.user.id);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedProduct = await productService.updateProductQuantity(id, quantity);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
}; 