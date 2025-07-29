const { pool } = require("../config/db");

const getProducts = async (userId) => {
  const products = await pool.query(
    "SELECT * FROM products WHERE userid = $1",
    [userId]
  );
  return products.rows;
};

const addProduct = async (productData, userId) => {
  const { name, type, sku, image_url, description, quantity, price } = productData;
  const newProduct = await pool.query(
    "INSERT INTO products (name, type, sku, image_url, description, quantity, price, userid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [name, type, sku, image_url, description, quantity, price, userId]
  );
  return newProduct.rows[0];
};

const updateProductQuantity = async (productId, quantity) => {
  const updatedProduct = await pool.query(
    "UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *",
    [quantity, productId]
  );
  return updatedProduct.rows[0];
};

module.exports = {
  getProducts,
  addProduct,
  updateProductQuantity,
}; 