const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.get(
  "/users",
  checkPermissions([UserType.MANAGEMENT, UserType.STAFF]),
  userController.getAllUsers
);
router.get("/users/:id", userController.getUserById);
router.post(
  "/users",
  checkPermissions([UserType.MANAGEMENT]),
  userController.createUser
);
router.put("/users/:id", userController.updateUser);
router.delete(
  "/users/:id",
  checkPermissions([UserType.MANAGEMENT]),
  userController.deleteUser
);

module.exports = router;
