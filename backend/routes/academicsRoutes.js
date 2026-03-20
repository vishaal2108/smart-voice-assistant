const express = require("express");
const router = express.Router();
const StaffAssignment = require("../models/StaffAssignment");
const StudentPerformance = require("../models/StudentPerformance");
const Student = require("../models/Student");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const computeOverallPercentage = (subjects) => {
  const total = subjects.reduce((sum, item) => sum + Number(item.mark || 0), 0);
  return Number((total / subjects.length).toFixed(2));
};

router.post(
  "/staff-assignments",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const { staffName, subject, department = "", year = "" } = req.body;

      if (!staffName || !subject) {
        return res.status(400).json({ message: "Staff name and subject are required" });
      }

      const assignment = await StaffAssignment.create({
        staffName,
        subject,
        department,
        year,
      });

      return res.status(201).json({ message: "Staff assignment added", data: assignment });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/staff-assignments", async (req, res) => {
  try {
    const assignments = await StaffAssignment.find().sort({ createdAt: -1 });
    return res.json(assignments);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/staff-assignments/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const { staffName, subject, department = "", year = "" } = req.body;

      if (!staffName || !subject) {
        return res.status(400).json({ message: "Staff name and subject are required" });
      }

      const updated = await StaffAssignment.findByIdAndUpdate(
        req.params.id,
        { staffName, subject, department, year },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Staff assignment not found" });
      }

      return res.json({ message: "Staff assignment updated", data: updated });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/staff-assignments/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const deleted = await StaffAssignment.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Staff assignment not found" });
      }

      return res.json({ message: "Staff assignment deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/students",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const students = await Student.find().sort({ name: 1, createdAt: -1 });
      return res.json(students);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/students",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const { name, email, parentEmail, department = "", year = "", phone = "", address = "" } = req.body;

      if (!name || !email || !parentEmail) {
        return res.status(400).json({ message: "Name, student email and parent email are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedParentEmail = String(parentEmail).trim().toLowerCase();

      const existingStudent = await Student.findOne({ email: normalizedEmail });

      if (existingStudent) {
        existingStudent.name = name;
        existingStudent.parentEmail = normalizedParentEmail;
        existingStudent.department = department;
        existingStudent.year = year;
        existingStudent.phone = phone;
        existingStudent.address = address;
        existingStudent.updatedBy = req.user.email;
        await existingStudent.save();

        return res.json({
          message: "Student details updated for existing email",
          data: existingStudent,
        });
      }

      const student = await Student.create({
        name,
        email: normalizedEmail,
        parentEmail: normalizedParentEmail,
        department,
        year,
        phone,
        address,
        createdBy: req.user.email,
        updatedBy: req.user.email,
      });

      return res.status(201).json({ message: "Student created", data: student });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/students/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, parentEmail, department = "", year = "", phone = "", address = "" } = req.body;

      if (!name || !email || !parentEmail) {
        return res.status(400).json({ message: "Name, student email and parent email are required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedParentEmail = String(parentEmail).trim().toLowerCase();

      const duplicate = await Student.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (duplicate) {
        return res.status(409).json({ message: "Another student already uses this email" });
      }

      const updated = await Student.findByIdAndUpdate(
        id,
        {
          name,
          email: normalizedEmail,
          parentEmail: normalizedParentEmail,
          department,
          year,
          phone,
          address,
          updatedBy: req.user.email,
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json({ message: "Student updated", data: updated });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/students/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const deleted = await Student.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json({ message: "Student removed" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/student-performance",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const {
        studentEmail,
        studentName,
        parentEmail,
        month,
        attendancePercentage,
        subjects,
      } = req.body;

      if (!studentEmail || !studentName || !parentEmail || !month) {
        return res.status(400).json({ message: "Student, parent and month details are required" });
      }

      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message: "At least one subject mark is required" });
      }

      const normalizedSubjects = subjects.map((item) => ({
        subject: String(item.subject || "").trim(),
        mark: Number(item.mark),
      }));

      const hasInvalidSubject = normalizedSubjects.some(
        (item) => !item.subject || Number.isNaN(item.mark) || item.mark < 0 || item.mark > 100
      );

      if (hasInvalidSubject) {
        return res.status(400).json({ message: "Each subject must have a mark between 0 and 100" });
      }

      const numericAttendance = Number(attendancePercentage);
      if (Number.isNaN(numericAttendance) || numericAttendance < 0 || numericAttendance > 100) {
        return res.status(400).json({ message: "Attendance percentage must be between 0 and 100" });
      }

      const overallPercentage = computeOverallPercentage(normalizedSubjects);

      const record = await StudentPerformance.findOneAndUpdate(
        { studentEmail: studentEmail.toLowerCase(), month },
        {
          studentEmail: studentEmail.toLowerCase(),
          studentName,
          parentEmail: parentEmail.toLowerCase(),
          month,
          attendancePercentage: numericAttendance,
          subjects: normalizedSubjects,
          overallPercentage,
          updatedBy: req.user.email,
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      return res.json({ message: "Student performance saved", data: record });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/parent/performance",
  authenticateToken,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const parentEmail = String(req.user.email || "").trim().toLowerCase();
      const records = await StudentPerformance.find({ parentEmail })
        .sort({ month: -1, studentName: 1 });
      return res.json(records);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/parent/students",
  authenticateToken,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const parentEmail = String(req.user.email || "").trim().toLowerCase();
      const students = await Student.find({ parentEmail }).sort({ name: 1 });
      return res.json(students);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
