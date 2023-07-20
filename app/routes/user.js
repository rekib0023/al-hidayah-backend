const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.get(
  "/",
  checkPermissions([UserType.MANAGEMENT, UserType.STAFF]),
  userController.getAllUsers
);
router.get("/:id", userController.getUserById);
router.post(
  "/",
  checkPermissions([UserType.MANAGEMENT]),
  userController.createUser
);
router.put("/:id", userController.updateUser);
router.delete(
  "/:id",
  checkPermissions([UserType.MANAGEMENT]),
  userController.deleteUser
);

module.exports = router;
