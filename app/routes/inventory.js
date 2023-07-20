const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.get("/products", inventoryController.getAllProducts);

router.post(
  "/products",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.createProduct
);

router.get("/products/:id", inventoryController.getProductById);

router.put(
  "/products/:id",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.updateProduct
);

router.delete(
  "/products/:id",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.deleteProduct
);

router.get("/categories", inventoryController.getAllCategories);

router.post(
  "/categories",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.createCategory
);

router.get("/categories/:id", inventoryController.getCategoryById);

router.put(
  "/categories/:id",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.updateCategory
);

router.delete(
  "/categories/:id",
  checkPermissions([UserType.MANAGEMENT]),
  inventoryController.deleteCategory
);

module.exports = router;
