const mongoose = require("mongoose");
const StaffAssignment = require("../models/StaffAssignment");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_voice_assistant";

const assignments = [
  {
    staffName: "Dr.V.Padmavathi",
    subject: "N/A",
    qualification: "M.E., Ph.D.",
    designation: "Professor & HOD",
    imageUrl: "/staff/dr-v-padmavathi.jpg",
    profilePdfUrl: "https://avccengg.net/documents/EEEDepartment/VP_new1.pdf",
  },
  {
    staffName: "Dr.K.Aruna",
    subject: "Web Development",
    qualification: "M.E., Ph.D.",
    designation: "Associate Professor",
    imageUrl: "/staff/dr-k-aruna.png",
    profilePdfUrl: "https://avccengg.net/documents/ITDepartment/KA_new.pdf",
  },
  {
    staffName: "Dr.K.Manikandan",
    subject: "Data Science",
    qualification: "M.C.A., M.Phil, M.Tech., Ph.D.",
    designation: "Assistant Professor",
    imageUrl: "/staff/dr-k-manikandan.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/8mrkm.pdf",
  },
  {
    staffName: "Mrs.D.Mahalakshmi",
    subject: "Data Structures",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-d-mahalakshmi.png",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/DM.pdf",
  },
  {
    staffName: "Mrs.V.Ezhilarasi",
    subject: "AI/ML",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-v-ezhilarasi.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/VE.pdf",
  },
  {
    staffName: "Mr.N.P.K.Ganesh Kumar",
    subject: "Big Data",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mr-npk-ganesh-kumar.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/npkg.pdf",
  },
  {
    staffName: "Mrs.S.Gayathri",
    subject: "Network Security",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-s-gayathri.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/sg.pdf",
  },
  {
    staffName: "Mrs.S.Jeevitha",
    subject: "Fullstack",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-s-jeevitha.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/sj.pdf",
  },
  {
    staffName: "Mrs.M.Priyadarshini",
    subject: "Cloud Computing",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-m-priyadarshini.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/FD.pdf",
  },
  {
    staffName: "Mr.M.A.MOHAMED ASSAM",
    subject: "N/A",
    qualification: "M.E.",
    designation: "Assistant Professor",
    imageUrl: "/staff/mr-m-a-mohamed-assam.jpg",
    profilePdfUrl: "https://avccengg.net/documents/ITDepartment/MA_new.pdf",
  },
  {
    staffName: "Mrs.N.Shuruthi",
    subject: "N/A",
    qualification: "M.E., (Ph.D)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-n-shuruthi.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/na.pdf",
  },
  {
    staffName: "Ms.B. Bhakyalakshmi",
    subject: "N/A",
    qualification: "M.E.",
    designation: "Assistant Professor",
    imageUrl: "/staff/ms-b-bhakyalakshmi.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/bb.pdf",
  },
  {
    staffName: "Mrs.G.Renuga",
    subject: "N/A",
    qualification: "M.E.",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-g-renuga.jpg",
    profilePdfUrl: "https://avccengg.net/documents/Profilepdf/gr.pdf",
  },
  {
    staffName: "Mrs.S.Sangeetha",
    subject: "N/A",
    qualification: "M.E.(CSE)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-s-sangeetha.jpg",
    profilePdfUrl: "",
  },
  {
    staffName: "Mrs.S.Saranya",
    subject: "N/A",
    qualification: "M.E(CSE)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-s-saranya.jpg",
    profilePdfUrl: "https://avccengg.net/documents/AIDSDepartment/SSIT.pdf",
  },
  {
    staffName: "Mrs.P.Anitha",
    subject: "N/A",
    qualification: "M.E(CSE)",
    designation: "Assistant Professor",
    imageUrl: "/staff/mrs-p-anitha.jpg",
    profilePdfUrl: "https://avccengg.net/documents/AIDSDepartment/PAIT.pdf",
  },
  {
    staffName: "Ms.M.Sushma Sri",
    subject: "N/A",
    qualification: "B.E.",
    designation: "Technical Assistant",
    imageUrl: "/staff/default-profile.jpg",
    profilePdfUrl: "",
  },
  {
    staffName: "Mr. M. Vijay",
    subject: "N/A",
    qualification: "DCT.",
    designation: "Technical Assistant",
    imageUrl: "/staff/default-profile.jpg",
    profilePdfUrl: "",
  },
  {
    staffName: "Mr.N.Bharanitharan",
    subject: "N/A",
    qualification: "-",
    designation: "Lab Assistant",
    imageUrl: "/staff/default-profile.jpg",
    profilePdfUrl: "",
  },
  {
    staffName: "Mrs.R.Chitra",
    subject: "N/A",
    qualification: "B.E.",
    designation: "Lab Assistant",
    imageUrl: "/staff/default-profile.jpg",
    profilePdfUrl: "",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    for (const item of assignments) {
      await StaffAssignment.findOneAndUpdate(
        { staffName: item.staffName },
        {
          staffName: item.staffName,
          subject: item.subject,
          qualification: item.qualification || "",
          designation: item.designation || "",
          department: "CSE",
          year: "",
          imageUrl: item.imageUrl,
          profilePdfUrl: item.profilePdfUrl || "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("Staff subject assignments seeded successfully.");
  } catch (error) {
    console.error("Failed to seed staff assignments:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
