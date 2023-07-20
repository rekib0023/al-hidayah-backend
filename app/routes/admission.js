const express = require("express");
const router = express.Router();
const admissionController = require("../controllers/admissionController");

router.post("/", admissionController.createAdmission);
router.get("/", admissionController.getAllAdmissions);
router.get("/:id", admissionController.getAdmissionById);
router.put("/:id", admissionController.updateAdmissionById);
router.delete("/:id", admissionController.deleteAdmissionById);

module.exports = router;
