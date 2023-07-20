const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.post(
  "/",
  checkPermissions([UserType.MANAGEMENT]),
  noticeController.createNotice
);

router.get("/", noticeController.getAllNotices);
router.put("/:id", noticeController.updateNotice);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;
