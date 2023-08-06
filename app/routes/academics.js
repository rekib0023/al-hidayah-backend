const express = require("express");
const router = express.Router();

const academicController = require("../controllers/academicController")

router.post("/exam", academicController.createExam)
router.get("/exam", academicController.getAllExams)
router.get("/exam/:examId", academicController.getExam)
router.post("/exam/:examId/result", academicController.addResultToExam)
router.get('/exam/:examId/student/:studentId/result', academicController.getStudentExamResult);



module.exports = router;