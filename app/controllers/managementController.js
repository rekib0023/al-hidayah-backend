const Student = require("../models/student");
const Employee = require("../models/employee");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const { s3 } = require("../utils/s3");
const { UserType } = require("../utils/constants");
const Attendance = require("../models/attendance");
const moment = require("moment-timezone");

const ManagementController = {
  uploadStudents: async (req, res, next) => {
    const rollNumberCount = {};
    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const users = [];
      const students = [];

      for (const row of jsonData) {
        const {
          firstName = "",
          lastName = "",
          email = "",
          dob = "",
          address = "",
          phone = "",
          batch = "",
          classN = "",
          parentsDetail = "",
        } = row;

        const password = dob.split("-").reverse().join("");
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
          firstName,
          lastName,
          email,
          dob,
          address,
          phone,
          password: hashedPassword,
          type: UserType.STUDENT,
        });
        users.push(user);

        const rollNumber = getRollNumber(classN);
        students.push({
          user: user._id,
          rollNumber,
          batch,
          class: classN,
          parentsDetail,
        });
      }

      await User.insertMany(users);
      await Student.insertMany(students);

      res.json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading students:", error);
      res.status(500).json({ error: "Failed to upload students" });
    }

    function getRollNumber(classN) {
      if (!rollNumberCount[classN]) {
        rollNumberCount[classN] = 1;
      } else {
        rollNumberCount[classN]++;
      }
      return rollNumberCount[classN];
    }
  },
  createStudent: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      dob,
      address,
      phone,
      batch,
      classN,
      parentsDetail,
    } = req.body;

    const lastStudent = await Student.findOne({ class: classN }, "rollNumber", {
      sort: { rollNumber: -1 },
    });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json("User already exists with this email address");
    }

    const rollNumber = lastStudent ? Number(lastStudent.rollNumber) + 1 : 1;
    const password = dob.split("-").reverse().join("");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      email,
      dob,
      address,
      phone,
      password: hashedPassword,
      type: UserType.STUDENT,
    });
    const student = new Student({
      user: user._id,
      rollNumber,
      batch,
      class: classN,
      parentsDetail,
    });
    try {
      await user.save();
      await student.save();
      const populatedStudent = await Student.findById(student._id).populate(
        "user",
        "-password"
      );

      return res.status(201).json(populatedStudent);
    } catch (error) {
      console.log("Error while creating user: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllStudents: async (req, res) => {
    try {
      const { class: searchClass } = req.query;

      const query = searchClass ? { class: searchClass } : {};

      Student.find(query)
        .populate({
          path: "attendance",
        })
        .populate("user", "-password")
        .then((students) => {
          res.json(students);
        })
        .catch((err) => {
          console.error("Error retrieving students:", err);
          res.status(500).json({ error: "Failed to retrieve students" });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  getStudent: async (req, res) => {
    const { id } = req.params;

    try {
      const student = await Student.findById(id)
        .populate({
          path: "attendance",
        })
        .populate("user", "-password");
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  deleteStudent: async (req, res) => {
    const { id } = req.params;

    try {
      const student = await Student.findByIdAndDelete(id);
      if (student) {
        res.json({ message: "Student Deleted", student });
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  addAttendance: async (req, res) => {
    const { userId, subject, date, isPresent, userType } = req.body;
    const parsedDate = moment.utc(date).utcOffset("+05:30").toDate();

    try {
      let user;

      if (userType === UserType.STUDENT) {
        user = await Student.findById(userId);
      } else if (userType === UserType.STAFF) {
        user = await Employee.findById(userId);
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let attendance = await Attendance.findOneAndUpdate(
        { user: userId, date: parsedDate },
        { upsert: true, new: true }
      );
      attendance.isPresent = isPresent;
      if (userType === UserType.STUDENT) {
        attendance.subject = subject;
      }

      await attendance.save();

      // Update the user's attendance array with the new attendance record
      user.attendance.push(attendance);
      await user.save();

      return res.status(201).json(attendance);
    } catch (error) {
      console.log("Error while creating attendance: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getAttendance: async (req, res) => {
    try {
      const { userId } = req.params;

      // Find attendance records for a specific user
      const attendance = await Attendance.find({ user: userId });

      res.json(attendance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const { attendanceId } = req.params;
      const { subject, date, isPresent } = req.body;

      await Attendance.findByIdAndUpdate(
        attendanceId,
        { subject, date, isPresent },
        { new: true }
      );

      res.json({ message: "Attendance updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const { attendanceId } = req.params;

      await Attendance.findByIdAndRemove(attendanceId);

      res.json({ message: "Attendance deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
};

module.exports = ManagementController;
