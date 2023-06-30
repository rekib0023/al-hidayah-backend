const Notice = require("../models/notice");

const NoticeController = {
  createNotice: async (req, res) => {
    try {
      const { title, description, imageUrl } = req.body;
      const notice = new Notice({ title, description, imageUrl });
      await notice.save();
      res.status(201).json(notice);
    } catch (error) {
      res.status(500).json({ error: "Failed to create notice" });
    }
  },
  getAllNotices: async (req, res) => {
    try {
      const {
        limit = 10,
        offset = 0,
        title = "",
        showAll = "false",
      } = req.query;

      const filters = {};
      if (title) {
        filters.title = { $regex: title, $options: "i" };
      }

      const totalNotices = await Notice.countDocuments(filters);

      let notices;
      if (showAll === "false") {
        notices = await Notice.find(filters)
          .skip(Number(offset))
          .limit(Number(limit));
      } else {
        notices = await Notice.find(filters);
      }

      res.json({
        totalNotices,
        notices,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  },

  updateNotice: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const notice = await Notice.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );

      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }

      res.json(notice);
    } catch (error) {
      res.status(500).json({ error: "Failed to update notice" });
    }
  },
  deleteNotice: async (req, res) => {
    try {
      const { id } = req.params;

      const notice = await Notice.findByIdAndDelete(id);

      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }

      res.json({ message: "Notice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notice" });
    }
  },
};

module.exports = NoticeController;
