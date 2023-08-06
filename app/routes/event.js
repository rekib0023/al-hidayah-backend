const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.post(
  "/",
  checkPermissions([UserType.MANAGEMENT]),
  eventController.createEvent
);

router.get("/", eventController.getAllEvents);

module.exports = router;
