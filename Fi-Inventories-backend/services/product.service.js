const { pool } = require("../config/db");

const getProducts = async (userId) => {
  const [products] = await pool.query(
    "SELECT * FROM products WHERE userid = ?",
    [userId]
  );
  return products;
};

const addProduct = async (productData, userId) => {
  const { name, type, sku, image_url, description, quantity, price } = productData;
  const [result] = await pool.query(
    "INSERT INTO products (name, type, sku, image_url, description, quantity, price, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, type, sku, image_url, description, quantity, price, userId]
  );

  const [newProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [result.insertId]);

  return newProduct[0];
};

const updateProductQuantity = async (productId, quantity) => {
  await pool.query(
    "UPDATE products SET quantity = ? WHERE id = ?",
    [quantity, productId]
  );
  const [updatedProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
  return updatedProduct[0];
};

const deleteProduct = async (productId) => {
    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    await pool.query("DELETE FROM products WHERE id = ?", [productId]);
    return product[0];
};

module.exports = {
  getProducts,
  addProduct,
  updateProductQuantity,
  deleteProduct,
}; 