const express = require("express");
const router = express.Router();
const managementController = require("../controllers/managementController");
const employeeController = require("../controllers/employeeController");
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

router.get(
  "/students/:id",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.getStudent
);
router.delete(
  "/students/:id",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.deleteStudent
);
router.post(
  "/employees",
  checkPermissions([UserType.MANAGEMENT]),
  employeeController.createEmployee
);
router.get(
  "/employees",
  checkPermissions([UserType.MANAGEMENT]),
  employeeController.getAllEmployees
);
router.delete(
  "/employees/:id",
  checkPermissions([UserType.MANAGEMENT]),
  employeeController.deleteEmployee
);

router.post(
  "/attendance",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.addAttendance
);
router.get("/attendance", managementController.getAttendance);
router.delete(
  "/attendance/:id",
  checkPermissions([UserType.MANAGEMENT]),
  managementController.deleteAttendance
);

module.exports = router;
