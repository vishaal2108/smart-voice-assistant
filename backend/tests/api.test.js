const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

let mongoServer;
let usingMemoryServer = false;
const fallbackUri =
  process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/smart_voice_assistant_test";
const shouldUseMemoryServer =
  process.env.USE_MEMORY_DB === "true" ||
  (process.env.USE_MEMORY_DB !== "false" && process.platform !== "win32");

const registerUser = async ({ email, password = "Password123!", role }) => {
  const res = await request(app)
    .post("/api/register")
    .send({ email, password, role });
  return res;
};

const loginUser = async ({ email, password = "Password123!", role }) => {
  const res = await request(app)
    .post(`/api/login/${role}`)
    .send({ email, password });
  return res;
};

describe("Smart College Assistant API", () => {
  beforeAll(async () => {
    if (shouldUseMemoryServer) {
      try {
        mongoServer = await MongoMemoryServer.create();
        usingMemoryServer = true;
        await mongoose.connect(mongoServer.getUri(), { dbName: "smart_college_test" });
        return;
      } catch (error) {
        usingMemoryServer = false;
      }
    }

    await mongoose.connect(fallbackUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer && usingMemoryServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    if (usingMemoryServer) {
      await mongoose.connection.db.dropDatabase();
    } else {
      await mongoose.connection.db.dropDatabase();
    }
  });

  test("staff can CRUD notices; student cannot create", async () => {
    await registerUser({ email: "staff1@example.com", role: "staff" });
    await registerUser({ email: "student1@example.com", role: "student" });

    const staffLogin = await loginUser({ email: "staff1@example.com", role: "staff" });
    const studentLogin = await loginUser({ email: "student1@example.com", role: "student" });

    const staffToken = staffLogin.body.token;
    const studentToken = studentLogin.body.token;

    const studentCreate = await request(app)
      .post("/api/notices")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ title: "Exam", content: "Mid-term on Friday", date: "2026-03-24" });
    expect(studentCreate.status).toBe(403);

    const createRes = await request(app)
      .post("/api/notices")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ title: "Exam", content: "Mid-term on Friday", date: "2026-03-24" });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data).toBeDefined();

    const noticeId = createRes.body.data._id;

    const listRes = await request(app).get("/api/notices");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);

    const updateRes = await request(app)
      .put(`/api/notices/${noticeId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ title: "Exam Updated", content: "Mid-term on Monday", date: "2026-03-24" });
    expect(updateRes.status).toBe(200);

    const deleteRes = await request(app)
      .delete(`/api/notices/${noticeId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(deleteRes.status).toBe(200);
  });

  test("timetable validates payload and enforces staff-only writes", async () => {
    await registerUser({ email: "staff2@example.com", role: "staff" });
    await registerUser({ email: "student2@example.com", role: "student" });

    const staffLogin = await loginUser({ email: "staff2@example.com", role: "staff" });
    const studentLogin = await loginUser({ email: "student2@example.com", role: "student" });

    const staffToken = staffLogin.body.token;
    const studentToken = studentLogin.body.token;

    const invalidCreate = await request(app)
      .post("/api/timetable")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ day: "", subject: "AI", time: "10:00 AM" });
    expect(invalidCreate.status).toBe(400);

    const studentCreate = await request(app)
      .post("/api/timetable")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ day: "Monday", subject: "AI", time: "10:00 AM" });
    expect(studentCreate.status).toBe(403);

    const createRes = await request(app)
      .post("/api/timetable")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ day: "Monday", subject: "AI", time: "10:00 AM" });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get("/api/timetable");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);
  });

  test("parent can access linked students and performance", async () => {
    await registerUser({ email: "staff3@example.com", role: "staff" });
    await registerUser({ email: "parent1@example.com", role: "parent" });

    const staffLogin = await loginUser({ email: "staff3@example.com", role: "staff" });
    const parentLogin = await loginUser({ email: "parent1@example.com", role: "parent" });

    const staffToken = staffLogin.body.token;
    const parentToken = parentLogin.body.token;

    const studentRes = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        name: "Jane Doe",
        email: "jane@student.com",
        parentEmail: "parent1@example.com",
        department: "IT",
        year: "3",
      });
    expect(studentRes.status).toBe(201);

    const perfRes = await request(app)
      .post("/api/student-performance")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        studentEmail: "jane@student.com",
        studentName: "Jane Doe",
        parentEmail: "parent1@example.com",
        month: "2026-03",
        attendancePercentage: 92,
        subjects: [{ subject: "AI", mark: 88 }],
      });
    expect(perfRes.status).toBe(200);

    const parentStudents = await request(app)
      .get("/api/parent/students")
      .set("Authorization", `Bearer ${parentToken}`);
    expect(parentStudents.status).toBe(200);
    expect(parentStudents.body.length).toBe(1);

    const parentPerformance = await request(app)
      .get("/api/parent/performance")
      .set("Authorization", `Bearer ${parentToken}`);
    expect(parentPerformance.status).toBe(200);
    expect(parentPerformance.body.length).toBe(1);
  });

  test("staff can CRUD fees, placements, circulars; student cannot write", async () => {
    await registerUser({ email: "staff4@example.com", role: "staff" });
    await registerUser({ email: "student4@example.com", role: "student" });

    const staffLogin = await loginUser({ email: "staff4@example.com", role: "staff" });
    const studentLogin = await loginUser({ email: "student4@example.com", role: "student" });

    const staffToken = staffLogin.body.token;
    const studentToken = studentLogin.body.token;

    const feePayload = {
      department: "IT",
      year: "2",
      totalFee: 45000,
      dueDate: "2026-06-30",
    };

    const studentFeeCreate = await request(app)
      .post("/api/fees")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(feePayload);
    expect(studentFeeCreate.status).toBe(403);

    const feeCreate = await request(app)
      .post("/api/fees")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(feePayload);
    expect(feeCreate.status).toBe(201);
    const feeId = feeCreate.body.data._id;

    const feeUpdate = await request(app)
      .put(`/api/fees/${feeId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...feePayload, totalFee: 48000 });
    expect(feeUpdate.status).toBe(200);

    const feeDelete = await request(app)
      .delete(`/api/fees/${feeId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(feeDelete.status).toBe(200);

    const placementPayload = {
      companyName: "OpenAI",
      package: "12 LPA",
      eligibility: "CGPA 7+",
      date: "2026-04-10",
    };

    const studentPlacementCreate = await request(app)
      .post("/api/placements")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(placementPayload);
    expect(studentPlacementCreate.status).toBe(403);

    const placementCreate = await request(app)
      .post("/api/placements")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(placementPayload);
    expect(placementCreate.status).toBe(201);
    const placementId = placementCreate.body.data._id;

    const placementUpdate = await request(app)
      .put(`/api/placements/${placementId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...placementPayload, eligibility: "CGPA 7.5+" });
    expect(placementUpdate.status).toBe(200);

    const placementDelete = await request(app)
      .delete(`/api/placements/${placementId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(placementDelete.status).toBe(200);

    const circularPayload = {
      title: "Holiday",
      content: "College closed on Friday",
      date: "2026-04-05",
    };

    const studentCircularCreate = await request(app)
      .post("/api/circulars")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(circularPayload);
    expect(studentCircularCreate.status).toBe(403);

    const circularCreate = await request(app)
      .post("/api/circulars")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(circularPayload);
    expect(circularCreate.status).toBe(201);
    const circularId = circularCreate.body.data._id;

    const circularUpdate = await request(app)
      .put(`/api/circulars/${circularId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...circularPayload, content: "College closed on Monday" });
    expect(circularUpdate.status).toBe(200);

    const circularDelete = await request(app)
      .delete(`/api/circulars/${circularId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(circularDelete.status).toBe(200);
  });

  test("staff can CRUD staff assignments and students; parent cannot write", async () => {
    await registerUser({ email: "staff5@example.com", role: "staff" });
    await registerUser({ email: "parent2@example.com", role: "parent" });

    const staffLogin = await loginUser({ email: "staff5@example.com", role: "staff" });
    const parentLogin = await loginUser({ email: "parent2@example.com", role: "parent" });

    const staffToken = staffLogin.body.token;
    const parentToken = parentLogin.body.token;

    const assignmentPayload = {
      staffName: "Dr. Rao",
      subject: "AI",
      department: "IT",
      year: "3",
    };

    const parentCreate = await request(app)
      .post("/api/staff-assignments")
      .set("Authorization", `Bearer ${parentToken}`)
      .send(assignmentPayload);
    expect(parentCreate.status).toBe(403);

    const createAssignment = await request(app)
      .post("/api/staff-assignments")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(assignmentPayload);
    expect(createAssignment.status).toBe(201);
    const assignmentId = createAssignment.body.data._id;

    const updateAssignment = await request(app)
      .put(`/api/staff-assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...assignmentPayload, subject: "ML" });
    expect(updateAssignment.status).toBe(200);

    const deleteAssignment = await request(app)
      .delete(`/api/staff-assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(deleteAssignment.status).toBe(200);

    const studentPayload = {
      name: "Tom",
      email: "tom@student.com",
      parentEmail: "parent2@example.com",
      department: "IT",
      year: "2",
    };

    const parentStudentCreate = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${parentToken}`)
      .send(studentPayload);
    expect(parentStudentCreate.status).toBe(403);

    const studentCreate = await request(app)
      .post("/api/students")
      .set("Authorization", `Bearer ${staffToken}`)
      .send(studentPayload);
    expect(studentCreate.status).toBe(201);
    const studentId = studentCreate.body.data._id;

    const studentUpdate = await request(app)
      .put(`/api/students/${studentId}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...studentPayload, name: "Tom Updated" });
    expect(studentUpdate.status).toBe(200);

    const studentDelete = await request(app)
      .delete(`/api/students/${studentId}`)
      .set("Authorization", `Bearer ${staffToken}`);
    expect(studentDelete.status).toBe(200);
  });

  test("missing or invalid auth returns 401/403", async () => {
    const noTokenRes = await request(app).post("/api/notices").send({
      title: "No Token",
      content: "Should fail",
    });
    expect(noTokenRes.status).toBe(401);

    const invalidTokenRes = await request(app)
      .post("/api/notices")
      .set("Authorization", "Bearer invalidtoken")
      .send({
        title: "Bad Token",
        content: "Should fail",
      });
    expect(invalidTokenRes.status).toBe(401);

    await registerUser({ email: "student6@example.com", role: "student" });
    const studentLogin = await loginUser({ email: "student6@example.com", role: "student" });
    const studentToken = studentLogin.body.token;

    const forbiddenRes = await request(app)
      .post("/api/notices")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Forbidden",
        content: "Should be blocked",
      });
    expect(forbiddenRes.status).toBe(403);
  });
});
