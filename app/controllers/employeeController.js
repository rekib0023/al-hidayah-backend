const Employee = require("../models/employee");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const department = req.query.department;
      let query = {};
      if (department) {
        query.department = department;
      }

      const employees = await Employee.find(query)
        .populate({
          path: "attendance",
        })
        .populate("user", "-password");
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch employees" });
    }
  },

  getEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await Employee.findById(id)
        .populate({
          path: "attendance",
        })
        .populate("user", "-password");
      if (employee) {
        res.json(employee);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  createEmployee: async (req, res) => {
    try {
      const dob = req.body.dob;
      const password = dob.split("-").reverse().join("");
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        dob: req.body.dob,
        address: req.body.address,
        phone: req.body.phone,
        type: req.body.type,
      });

      const savedUser = await user.save();

      const employee = new Employee({
        user: savedUser._id,
        department: req.body.department,
        dateOfJoining: req.body.dateOfJoining,
        salary: req.body.salary,
        employeeNumber: req.body.employeeNumber,
        jobTitle: req.body.jobTitle,
        emergencyContact: req.body.emergencyContact,
        bankDetails: req.body.bankDetails,
        documents: req.body.documents,
      });

      const savedEmployee = await employee.save();

      res.json(savedEmployee);
    } catch (error) {
      res.status(500).json({ error: "Unable to create employee" });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      employee.department = req.body.department;
      employee.dateOfJoining = req.body.dateOfJoining;
      employee.salary = req.body.salary;
      employee.employeeNumber = req.body.employeeNumber;
      employee.jobTitle = req.body.jobTitle;
      employee.emergencyContact = req.body.emergencyContact;
      employee.bankDetails = req.body.bankDetails;
      employee.documents = req.body.documents;

      const updatedEmployee = await employee.save();

      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ error: "Unable to update employee" });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Unable to delete employee" });
    }
  },
};

module.exports = employeeController;
