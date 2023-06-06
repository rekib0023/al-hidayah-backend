const User = require("../models/user");
const bcrypt = require("bcrypt");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  },
  createUser: async (req, res) => {
    const { name, email, password, dob, address, phone, type } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        dob,
        address,
        phone,
        type,
      });

      res.status(201).json({ message: "User created", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, password, dob, address, phone, type } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          password,
          dob,
          address,
          phone,
          type,
        },
        { new: true }
      );
      if (user) {
        res.json({ message: "User updated", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndDelete(id);
      if (user) {
        res.json({ message: "User deleted", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
};

module.exports = userController;
