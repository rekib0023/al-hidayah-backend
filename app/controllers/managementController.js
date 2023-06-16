const Student = require("../models/student");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const { s3 } = require("../utils/s3");
const { UserType } = require("../utils/constants");

const ManagementController = {
  uploadStudents: async (req, res, next) => {
    console.log("a");
    const params = {
      Bucket: "al-hidayah-bucket",
      Key: req.file.key,
    };
    const rollNumberCount = {};
    try {
      const data = await s3.getObject(params).promise();
      const workbook = XLSX.read(data.Body, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const users = [];
      const students = [];

      for (const row of jsonData) {
        const {
          firstName = "Unknown",
          lastName = "Unknown",
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
      await Student.insertMany(updatedStudents);

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
      return res.status(201).json(student);
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
        .populate("user", "-password")
        .then((students) => {
          let studentsData = {};
          students.forEach((student) => {
            if (!studentsData[student.class]) {
              studentsData[student.class] = [];
            }
            studentsData[student.class].push(student);
          });
          res.json(studentsData);
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
};

module.exports = ManagementController;
