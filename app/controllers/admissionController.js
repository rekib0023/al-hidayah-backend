const Admission = require('../models/preAdmission');

const admissionController = {

 createAdmission: async (req, res) => {
    try {
      const newAdmission = await Admission.create(req.body);
      res.status(201).json(newAdmission);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create a new student record.' });
    }
  },
  
  // Controller for fetching all student records
  getAllAdmissions : async (req, res) => {
    try {
      const students = await Admission.find();
      res.status(200).json(students);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Failed to fetch student records.' });
    }
  },
  
  // Controller for fetching a specific student record by ID
  getAdmissionById : async (req, res) => {
    try {
      const student = await Admission.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: 'Admission not found.' });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the student record.' });
    }
  },
  
  // Controller for updating a specific student record by ID
  updateAdmissionById : async (req, res) => {
    try {
      const updatedAdmission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedAdmission) {
        return res.status(404).json({ error: 'Admission not found.' });
      }
      res.status(200).json(updatedAdmission);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the student record.' });
    }
  },
  
  // Controller for deleting a specific student record by ID
  deleteAdmissionById : async (req, res) => {
    try {
      const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);
      if (!deletedAdmission) {
        return res.status(404).json({ error: 'Admission not found.' });
      }
      res.status(200).json(deletedAdmission);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the student record.' });
    }
  },

}


module.exports = admissionController;