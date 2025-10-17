import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// Paths to data files
const studentsFile = path.join(__dirname, "students.json");
const attendanceFile = path.join(__dirname, "attendance.json");

// ✅ Helper: safely read JSON
function readJSON(file) {
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading file:", file, err);
    return null;
  }
}

// ✅ Helper: safely write JSON
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error writing file:", file, err);
  }
}

// ✅ POST - Record attendance
app.post("/api/attendance", (req, res) => {
  const { id_number } = req.body;
  if (!id_number) {
    return res.status(400).json({ message: "Missing ID number." });
  }

  const studentsData = readJSON(studentsFile);
  if (!studentsData || !studentsData.members) {
    return res.status(500).json({ message: "Students data not found." });
  }

  // Look inside members array
  const student = studentsData.members.find((s) => s.id_number === id_number);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  const attendance = readJSON(attendanceFile) || [];
  const record = {
    ...student,
    timestamp: new Date().toLocaleString(),
  };

  attendance.push(record);
  writeJSON(attendanceFile, attendance);

  console.log("✅ Attendance recorded:", record.full_name);
  res.json(record);
});

// ✅ GET - Retrieve all attendance
app.get("/api/attendance", (req, res) => {
  const attendance = readJSON(attendanceFile) || [];
  res.json(attendance);
});

// ✅ Simple login for admin
const USER = {
  username: "100-00001",
  password: "admin",
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    res.json({ success: true, role: "admin" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// ✅ Root endpoint for testing
app.get("/", (req, res) => {
  res.send("✅ Server is running and ready!");
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
