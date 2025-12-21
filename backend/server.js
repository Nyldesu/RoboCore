/* npm install @getbrevo/brevo dotenv bcrypt jsonwebtoken express cors body-parser */
import ExcelJS from "exceljs";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://robocore.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(bodyParser.json());

// File helpers
async function ensureFile(file, defaultData) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
  }
}

async function readJSON(file) {
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading:", file, err);
    return null;
  }
}

async function writeJSON(file, data) {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error writing:", file, err);
  }
}

// File paths
const usersFile = path.join(__dirname, "users.json");
const emailsJSON = path.join(__dirname, "emails.json");

// Initialize files
await ensureFile(usersFile, { users: [] });
await ensureFile(emailsJSON, { emails: [] });

// Auth helpers
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // { email, role }
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

// Login limit
let loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000;

// Load users
async function loadUsers() {
  const data = await readJSON(usersFile);
  if (!data || !Array.isArray(data.users)) return [];
  return data.users;
}

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password." });

  if (!loginAttempts[email]) {
    loginAttempts[email] = { count: 0, lockUntil: 0 };
  }

  const attempts = loginAttempts[email];

  if (Date.now() < attempts.lockUntil) {
    return res.status(403).json({
      message: "Too many failed attempts. Wait 5 minutes.",
      lockUntil: attempts.lockUntil,
    });
  }

  const users = await loadUsers();
  const user = users.find(u => u.email === email);

  if (!user || !user.passwordHash) {
    attempts.count++;
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    attempts.count++;

    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.count = 0;
      attempts.lockUntil = Date.now() + LOCKOUT_TIME;

      return res.status(403).json({
        message: "Account locked for 5 minutes.",
        lockUntil: attempts.lockUntil,
      });
    }

    return res.status(401).json({
      message: "Invalid email or password.",
      attemptsLeft: MAX_ATTEMPTS - attempts.count,
    });
  }

  attempts.count = 0;
  attempts.lockUntil = 0;

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ success: true, role: user.role, token });
});

// Auth check
app.get("/api/me", verifyToken, (req, res) => {
  res.json({
    email: req.user.email,
    role: req.user.role,
  });
});

// Brevo email system
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function readEmailList() {
  const data = await readJSON(emailsJSON);
  return data?.emails || [];
}

async function sendAnnouncementEmail(subject, content, recipients) {
  const sendEmail = new Brevo.SendSmtpEmail();
  sendEmail.sender = {
    name: "Mj Castillon",
    email: "marcjohncastillon18@gmail.com",
  };
  sendEmail.to = recipients.map(email => ({ email }));
  sendEmail.subject = subject;
  sendEmail.htmlContent = `<h2>${subject}</h2><p>${content}</p>`;

  return await apiInstance.sendTransacEmail(sendEmail);
}

app.post(
  "/api/announcements",
  verifyToken,
  requireAdmin,
  async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Missing fields" });

    try {
      const recipients = await readEmailList();
      await sendAnnouncementEmail(
        `New Announcement: ${title}`,
        content,
        recipients
      );
      res.json({ success: true });
    } catch {
      res.status(500).json({ message: "Email sending error" });
    }
  }
);

// Attendance auth
app.post('/api/attendance', verifyToken, async (req, res) => {
  const { id_number } = req.body;

  if (!id_number || !id_number.trim()) {
    return res.status(400).json({ success: false, message: "Missing ID number." });
  }

  try {
    // 1️⃣ Fetch student by scanned ID number
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id_number', id_number)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // 2️⃣ Insert attendance record
    const timestamp = new Date().toISOString();
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .insert([{ student_id: student.id, timestamp }])
      .select()   // important to get the inserted row back
      .single();

    if (attendanceError) {
      return res.status(500).json({
        success: false,
        message: "Failed to record attendance",
        error: attendanceError
      });
    }

    // 3️⃣ Return the student object and timestamp
    res.json({
      success: true,
      student: {
        id_number: student.id_number,
        full_name: student.full_name,
        program: student.program || "",
        year: student.year || ""
      },
      timestamp: attendanceData?.timestamp || timestamp
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


// ==========================
// GET ALL ATTENDANCE RECORDS
// ==========================
app.get("/api/attendance", verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        timestamp,
        students (
          id_number,
          full_name,
          program,
          year
        )
      `)
      .order("timestamp", { ascending: false });

    if (error) throw error;

    const formatted = data.map((rec) => ({
      id_number: rec.students.id_number,
      full_name: rec.students.full_name,
      program: rec.students.program,
      year: rec.students.year,
      timestamp: rec.timestamp,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Attendance fetch error:", err);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

app.get("/api/attendance/export", verifyToken, async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    // Fetch attendance + student info
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        timestamp,
        students (
          id_number,
          full_name,
          program,
          year
        )
      `)
      .gte("timestamp", `${date}T00:00:00`)
      .lte("timestamp", `${date}T23:59:59`);

    if (error) throw error;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "ID Number", key: "id_number", width: 15 },
      { header: "Full Name", key: "full_name", width: 30 },
      { header: "Program", key: "program", width: 12 },
      { header: "Year", key: "year", width: 8 },
      { header: "Date", key: "date", width: 12 },
      { header: "Time", key: "time", width: 12 },
    ];

    data.forEach((row, i) => {
      const d = new Date(row.timestamp);

      sheet.addRow({
        index: i + 1,
        id_number: row.students.id_number,
        full_name: row.students.full_name,
        program: row.students.program,
        year: row.students.year,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
      });
    });

    // Header styling
    sheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance-${date}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Failed to export attendance" });
  }
});


// Error handler
app.get("/", (req, res) => {
  res.send("Backend running on Render ✔ Secure Login Enabled");
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
