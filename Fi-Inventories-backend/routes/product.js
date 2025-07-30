const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const productController = require("../controllers/product.controller");

router.get("", verifyToken, productController.getAllProducts);
router.post("", verifyToken, productController.createProduct);
router.put("/:id/quantity", verifyToken, productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;


