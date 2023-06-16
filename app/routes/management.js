const express = require("express");
const router = express.Router();
const managementController = require("../controllers/managementController");
const { upload } = require("../utils/s3");
const { checkPermissions } = require("../middlewares/authMiddleware");
const { UserType } = require("../utils/constants");

router.post(
  "/students/upload",
  checkPermissions([UserType.MANAGEMENT]),
  upload.single("file"),
  managementController.uploadStudents
);
router.post(
  "/students",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.createStudent
);
router.get(
  "/students",
  checkPermissions([UserType.MANAGEMENT, UserType.STAFF]),
  managementController.getAllStudents
);
router.delete(
  "/students/:id",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.deleteStudent
);

module.exports = router;
