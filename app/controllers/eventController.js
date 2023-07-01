const Appointment = require("../models/event");

const EventController = {
  createEvent: async (req, res) => {
    try {
      const event = new Appointment(req.body);
      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const events = await Appointment.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve events" });
    }
  },
  deleteEvents: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedEvent = await Appointment.findOneAndRemove({ id });
      if (!deletedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  },
};

module.exports = EventController;
