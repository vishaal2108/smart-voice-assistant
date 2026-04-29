const express = require("express");
const router = express.Router();
const StaffAssignment = require("../models/StaffAssignment");
const StudentPerformance = require("../models/StudentPerformance");
const Student = require("../models/Student");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { isRemovedStaff, normalizeStaffAssignments } = require("../utils/staffAssignments");
const {
  trimString,
  normalizeEmail,
  requireEmailField,
  requireFields,
  requireNumberField,
  requireObjectIdParam,
  isValidMonth,
} = require("../utils/validators");

const computeOverallPercentage = (subjects) => {
  const total = subjects.reduce((sum, item) => sum + Number(item.mark || 0), 0);
  return Number((total / subjects.length).toFixed(2));
};

const cleanString = (value) => trimString(value);

router.post(
  "/staff-assignments",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const staffName = cleanString(req.body.staffName);
      const subject = cleanString(req.body.subject);
      const department = cleanString(req.body.department);
      const year = cleanString(req.body.year);
      const designation = cleanString(req.body.designation);
      const qualification = cleanString(req.body.qualification);
      const imageUrl = cleanString(req.body.imageUrl);
      const profilePdfUrl = cleanString(req.body.profilePdfUrl);

      const requiredCheck = requireFields({ staffName, subject }, ["staffName", "subject"]);
      if (!requiredCheck.ok) {
        return res.status(400).json({ message: requiredCheck.message });
      }

      if (isRemovedStaff(staffName)) {
        return res.status(400).json({ message: "This staff member is no longer part of the IT department list" });
      }

      const assignment = await StaffAssignment.create({
        staffName,
        subject,
        designation,
        qualification,
        department,
        year,
        imageUrl,
        profilePdfUrl,
      });

      return res.status(201).json({ message: "Staff assignment added", data: assignment });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/staff-assignments", async (req, res) => {
  try {
    const assignments = await StaffAssignment.find();
    return res.json(normalizeStaffAssignments(assignments));
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
      const staffName = cleanString(req.body.staffName);
      const subject = cleanString(req.body.subject);
      const department = cleanString(req.body.department);
      const year = cleanString(req.body.year);
      const designation = cleanString(req.body.designation);
      const qualification = cleanString(req.body.qualification);
      const imageUrl = cleanString(req.body.imageUrl);
      const profilePdfUrl = cleanString(req.body.profilePdfUrl);

      const idCheck = requireObjectIdParam(req.params.id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

      const requiredCheck = requireFields({ staffName, subject }, ["staffName", "subject"]);
      if (!requiredCheck.ok) {
        return res.status(400).json({ message: requiredCheck.message });
      }

      if (isRemovedStaff(staffName)) {
        return res.status(400).json({ message: "This staff member is no longer part of the IT department list" });
      }

      const updated = await StaffAssignment.findByIdAndUpdate(
        req.params.id,
        {
          staffName,
          subject,
          designation,
          qualification,
          department,
          year,
          imageUrl,
          profilePdfUrl,
        },
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
      const idCheck = requireObjectIdParam(req.params.id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

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
      const cleanedName = cleanString(name);
      const emailCheck = requireEmailField(email, "email");
      if (!emailCheck.ok) {
        return res.status(400).json({ message: emailCheck.message });
      }

      const parentCheck = requireEmailField(parentEmail, "parentEmail");
      if (!parentCheck.ok) {
        return res.status(400).json({ message: parentCheck.message });
      }

      if (!cleanedName) {
        return res.status(400).json({ message: "name is required" });
      }

      const normalizedEmail = normalizeEmail(email);
      const normalizedParentEmail = normalizeEmail(parentEmail);

      const existingStudent = await Student.findOne({ email: normalizedEmail });

      if (existingStudent) {
        existingStudent.name = cleanedName;
        existingStudent.parentEmail = normalizedParentEmail;
        existingStudent.department = cleanString(department);
        existingStudent.year = cleanString(year);
        existingStudent.phone = cleanString(phone);
        existingStudent.address = cleanString(address);
        existingStudent.updatedBy = req.user.email;
        await existingStudent.save();

        return res.json({
          message: "Student details updated for existing email",
          data: existingStudent,
        });
      }

      const student = await Student.create({
        name: cleanedName,
        email: normalizedEmail,
        parentEmail: normalizedParentEmail,
        department: cleanString(department),
        year: cleanString(year),
        phone: cleanString(phone),
        address: cleanString(address),
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

      const idCheck = requireObjectIdParam(id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

      const cleanedName = cleanString(name);
      const emailCheck = requireEmailField(email, "email");
      if (!emailCheck.ok) {
        return res.status(400).json({ message: emailCheck.message });
      }

      const parentCheck = requireEmailField(parentEmail, "parentEmail");
      if (!parentCheck.ok) {
        return res.status(400).json({ message: parentCheck.message });
      }

      if (!cleanedName) {
        return res.status(400).json({ message: "name is required" });
      }

      const normalizedEmail = normalizeEmail(email);
      const normalizedParentEmail = normalizeEmail(parentEmail);

      const duplicate = await Student.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (duplicate) {
        return res.status(409).json({ message: "Another student already uses this email" });
      }

      const updated = await Student.findByIdAndUpdate(
        id,
        {
          name: cleanedName,
          email: normalizedEmail,
          parentEmail: normalizedParentEmail,
          department: cleanString(department),
          year: cleanString(year),
          phone: cleanString(phone),
          address: cleanString(address),
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
      const idCheck = requireObjectIdParam(req.params.id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

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

      const studentEmailCheck = requireEmailField(studentEmail, "studentEmail");
      if (!studentEmailCheck.ok) {
        return res.status(400).json({ message: studentEmailCheck.message });
      }

      const parentEmailCheck = requireEmailField(parentEmail, "parentEmail");
      if (!parentEmailCheck.ok) {
        return res.status(400).json({ message: parentEmailCheck.message });
      }

      const cleanedStudentName = cleanString(studentName);
      if (!cleanedStudentName) {
        return res.status(400).json({ message: "studentName is required" });
      }

      if (!isValidMonth(month)) {
        return res.status(400).json({ message: "month must be in YYYY-MM format" });
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

      const attendanceCheck = requireNumberField(attendancePercentage, "attendancePercentage", {
        min: 0,
        max: 100,
      });
      if (!attendanceCheck.ok) {
        return res.status(400).json({ message: attendanceCheck.message });
      }
      const numericAttendance = attendanceCheck.value;

      const overallPercentage = computeOverallPercentage(normalizedSubjects);

      const record = await StudentPerformance.findOneAndUpdate(
        { studentEmail: normalizeEmail(studentEmail), month },
        {
          studentEmail: normalizeEmail(studentEmail),
          studentName: cleanedStudentName,
          parentEmail: normalizeEmail(parentEmail),
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
  "/student-performance",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const records = await StudentPerformance.find().sort({ month: -1, studentName: 1 });
      return res.json(records);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/student-performance/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const idCheck = requireObjectIdParam(req.params.id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

      const {
        studentEmail,
        studentName,
        parentEmail,
        month,
        attendancePercentage,
        subjects,
      } = req.body;

      const studentEmailCheck = requireEmailField(studentEmail, "studentEmail");
      if (!studentEmailCheck.ok) {
        return res.status(400).json({ message: studentEmailCheck.message });
      }

      const parentEmailCheck = requireEmailField(parentEmail, "parentEmail");
      if (!parentEmailCheck.ok) {
        return res.status(400).json({ message: parentEmailCheck.message });
      }

      const cleanedStudentName = cleanString(studentName);
      if (!cleanedStudentName) {
        return res.status(400).json({ message: "studentName is required" });
      }

      if (!isValidMonth(month)) {
        return res.status(400).json({ message: "month must be in YYYY-MM format" });
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

      const attendanceCheck = requireNumberField(attendancePercentage, "attendancePercentage", {
        min: 0,
        max: 100,
      });
      if (!attendanceCheck.ok) {
        return res.status(400).json({ message: attendanceCheck.message });
      }

      const duplicate = await StudentPerformance.findOne({
        studentEmail: normalizeEmail(studentEmail),
        month,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({ message: "A performance record already exists for this student and month" });
      }

      const updated = await StudentPerformance.findByIdAndUpdate(
        req.params.id,
        {
          studentEmail: normalizeEmail(studentEmail),
          studentName: cleanedStudentName,
          parentEmail: normalizeEmail(parentEmail),
          month,
          attendancePercentage: attendanceCheck.value,
          subjects: normalizedSubjects,
          overallPercentage: computeOverallPercentage(normalizedSubjects),
          updatedBy: req.user.email,
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Student performance record not found" });
      }

      return res.json({ message: "Student performance updated", data: updated });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/student-performance/:id",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res) => {
    try {
      const idCheck = requireObjectIdParam(req.params.id, "id");
      if (!idCheck.ok) {
        return res.status(400).json({ message: idCheck.message });
      }

      const deleted = await StudentPerformance.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Student performance record not found" });
      }

      return res.json({ message: "Student performance deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/student/profile",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const student = await Student.findOne({ email: normalizeEmail(req.user.email) });
      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      return res.json(student);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/student/performance",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const records = await StudentPerformance.find({ studentEmail: normalizeEmail(req.user.email) }).sort({
        month: -1,
      });
      return res.json(records);
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
