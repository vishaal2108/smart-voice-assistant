const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const Placement = require("../models/Placement");
const Notice = require("../models/Notice");
const Circular = require("../models/Circular");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const createResourceRoutes = (path, Model) => {
  router.post(
    path,
    authenticateToken,
    authorizeRoles("staff"),
    async (req, res) => {
      try {
        const doc = new Model(req.body);
        await doc.save();
        return res.status(201).json({ message: `${Model.modelName} added`, data: doc });
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
    }
  );

  router.get(path, async (req, res) => {
    try {
      const docs = await Model.find().sort({ _id: -1 });
      return res.json(docs);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  router.put(
    `${path}/:id`,
    authenticateToken,
    authorizeRoles("staff"),
    async (req, res) => {
      try {
        const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!updated) {
          return res.status(404).json({ message: `${Model.modelName} not found` });
        }

        return res.json({ message: `${Model.modelName} updated`, data: updated });
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
    }
  );

  router.delete(
    `${path}/:id`,
    authenticateToken,
    authorizeRoles("staff"),
    async (req, res) => {
      try {
        const deleted = await Model.findByIdAndDelete(req.params.id);

        if (!deleted) {
          return res.status(404).json({ message: `${Model.modelName} not found` });
        }

        return res.json({ message: `${Model.modelName} deleted` });
      } catch (error) {
        return res.status(500).json({ message: "Server error" });
      }
    }
  );
};

createResourceRoutes("/fees", Fee);
createResourceRoutes("/placements", Placement);
createResourceRoutes("/notices", Notice);
createResourceRoutes("/circulars", Circular);

module.exports = router;
