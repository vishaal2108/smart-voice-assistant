const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const Placement = require("../models/Placement");
const Notice = require("../models/Notice");
const Circular = require("../models/Circular");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  isEmptyValue,
  trimString,
  requireFields,
  requireNumberField,
  requireObjectIdParam,
} = require("../utils/validators");

const trimBodyFields = (req, fields) => {
  fields.forEach((field) => {
    if (typeof req.body[field] === "string") {
      req.body[field] = trimString(req.body[field]);
    }
  });
};

const validateRequiredFields = (req, res, fields) => {
  const result = requireFields(req.body, fields);
  if (!result.ok) {
    res.status(400).json({ message: result.message });
    return false;
  }

  return true;
};

const normalizeNumericFields = (req, res, fields) => {
  for (const field of fields) {
    if (isEmptyValue(req.body[field])) {
      continue;
    }

    const result = requireNumberField(req.body[field], field);
    if (!result.ok) {
      res.status(400).json({ message: result.message });
      return false;
    }

    req.body[field] = result.value;
  }

  return true;
};

const createResourceRoutes = (path, Model, options = {}) => {
  const { requiredFields = [], numericFields = [] } = options;
  router.post(
    path,
    authenticateToken,
    authorizeRoles("staff"),
    async (req, res) => {
      try {
        trimBodyFields(req, requiredFields);
        if (!validateRequiredFields(req, res, requiredFields)) {
          return;
        }

        if (!normalizeNumericFields(req, res, numericFields)) {
          return;
        }

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
        const idCheck = requireObjectIdParam(req.params.id, "id");
        if (!idCheck.ok) {
          return res.status(400).json({ message: idCheck.message });
        }

        trimBodyFields(req, requiredFields);
        if (!validateRequiredFields(req, res, requiredFields)) {
          return;
        }

        if (!normalizeNumericFields(req, res, numericFields)) {
          return;
        }

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
        const idCheck = requireObjectIdParam(req.params.id, "id");
        if (!idCheck.ok) {
          return res.status(400).json({ message: idCheck.message });
        }

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

createResourceRoutes("/fees", Fee, {
  requiredFields: ["department", "year", "totalFee", "dueDate"],
  numericFields: ["totalFee"],
});
createResourceRoutes("/placements", Placement, {
  requiredFields: ["companyName", "package", "eligibility", "date"],
});
createResourceRoutes("/notices", Notice, {
  requiredFields: ["title", "content"],
});
createResourceRoutes("/circulars", Circular, {
  requiredFields: ["title", "content", "date"],
});

module.exports = router;
