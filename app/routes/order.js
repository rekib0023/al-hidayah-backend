const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.get("/", orderController.getAllOrderRequests);

router.post(
  "/",
  checkPermissions([UserType.MANAGEMENT]),
  orderController.createOrderRequest
);

router.get("/:id", orderController.getOrderRequestById);

router.put(
  "/:id",
  checkPermissions([UserType.MANAGEMENT]),
  orderController.updateOrderRequest
);

router.delete(
  "/:id",
  checkPermissions([UserType.MANAGEMENT]),
  orderController.deleteOrderRequest
);

module.exports = router;