const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateManagement } = require("../middlewares/authMiddleware");

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", authenticateManagement, userController.createUser);
router.put("/users/:id", authenticateManagement, userController.updateUser);
router.delete("/users/:id", authenticateManagement, userController.deleteUser);

module.exports = router;
