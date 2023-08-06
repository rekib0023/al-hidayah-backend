const Student = require("../models/student");
const { Exam, Result } = require("../models/exam");

const AcademicController = {
  createExam: async (req, res) => {
    const { name, examDate, classN } = req.body;
    try {
      const exam = new Exam({
        name,
        examDate,
        classN,
      });
      await exam.save();

      return res.status(201).json(exam);
    } catch (error) {
      console.log("Error while creating user: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllExams: async (req, res) => {
    try {
      const { classN } = req.query;
      const query = classN ? { classN } : {};

      const exams = await Exam.find(query)
        .populate({
          path: "result.student",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .exec();

      if (!exams || exams.length === 0) {
        return res.status(404).json({ error: "Exams not found" });
      }

      // // Calculate total marks and percentage for each student in each exam
      // exams.forEach((exam) => {
      //   exam.result.forEach((result) => {
      //     let totalMarksObtained = 0;
      //     let totalMarks = 0;

      //     result.marks.forEach((mark) => {
      //       totalMarksObtained += mark.marksObtained;
      //       totalMarks += mark.totalMarks;
      //     });

      //     result.totalMarksObtained = totalMarksObtained;
      //     result.totalMarks = totalMarks;

      //     if (totalMarks !== 0) {
      //       result.percent = (totalMarksObtained / totalMarks) * 100;
      //     } else {
      //       result.percent = 0;
      //     }
      //   });
      // });

      res.json(exams);
    } catch (error) {
      console.log("Error while creating user: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getExam: async (req, res) => {
    try {
      const examId = req.params.examId;
      const exam = await Exam.findById(examId)
        .populate({
          path: "result.student",
          populate: {
            path: "user",
            model: "User",
          },
        })
        .exec();

      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }

     

      res.json(exam);
    } catch (error) {
      console.log("Error while creating user: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  addResultToExam: async (req, res) => {
    const examId = req.params.examId;
    const { studentId, subject, date, marksObtained, totalMarks, isPresent } = req.body;
  
    try {
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
  
      let existingResult = exam.result.find((result) => result.student._id.toString() === studentId);
  
      if (existingResult) {
        // Append to marks array of existing result
        existingResult.marks.push({
          subject,
          date,
          marksObtained,
          totalMarks,
          isPresent,
        });
      } else {
        // Create a new result object and push it to the exam.result array
        const newResult = {
          student: studentId,
          marks: [
            {
              subject,
              date,
              marksObtained,
              totalMarks,
              isPresent,
            },
          ],
        };
  
        exam.result.push(newResult);
      }
  
      // Calculate totalMarksObtained, totalMarks, and percent for each result
      exam.result.forEach((result) => {
        let totalMarksObtained = 0;
        let totalMarks = 0;
  
        result.marks.forEach((mark) => {
          totalMarksObtained += mark.marksObtained;
          totalMarks += mark.totalMarks;
        });
  
        result.totalMarksObtained = totalMarksObtained;
        result.totalMarks = totalMarks;
  
        if (totalMarks !== 0) {
          result.percent = (totalMarksObtained / totalMarks) * 100;
        } else {
          result.percent = 0;
        }
      });
  
      await exam.save();
  
      return res.status(201).json(exam);
    } catch (error) {
      console.log("Error while adding result to exam: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  

  getStudentExamResult: async (req, res) => {
    try {
      const { studentId, examId } = req.params;

      // Find the exam by examId and populate the student and their marks
      const exam = await Exam.findOne({ _id: examId })
        .populate({
          path: "result",
          match: { student: studentId },
          populate: {
            path: "student",
            model: "Student",
            populate: {
              path: "user",
              model: "User",
            },
          },
        })
        .exec();

      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      if (!exam.result || exam.result.length === 0) {
        return res
          .status(404)
          .json({ message: "Result not found for the student in this exam" });
      }

      // Since we used "match" in the population, there should be only one result for the student in this exam
      const studentResult = exam.result[0];

      res.json(studentResult);
    } catch (error) {
      console.error("Error while retrieving student exam result:", error);
      return res
        .status(500)
        .json({ error: "Failed to retrieve student exam result" });
    }
  },
};

module.exports = AcademicController;
