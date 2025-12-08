/* npm install @getbrevo/brevo dotenv bcrypt jsonwebtoken express cors body-parser */

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

dotenv.config();

const app = express();

// REQUIRED for Render
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

// Ensure JSON file exists
async function ensureFile(file, defaultData) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
  }
}

// JSON helpers
async function readJSON(file) {
  try {
    await ensureFile(file, {}); 
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

// Files
const usersFile = path.join(__dirname, "users.json");
const emailsJSON = path.join(__dirname, "emails.json");
const studentsFile = path.join(__dirname, "students.json");
const attendanceFile = path.join(__dirname, "attendance.json");

/* -------------------------
   INITIALIZE ALL FILES
--------------------------*/

await ensureFile(usersFile, { users: [] });
await ensureFile(emailsJSON, { emails: [] });
await ensureFile(studentsFile, { members: [] });
await ensureFile(attendanceFile, []);

// Login limits
let loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000;

// Load users
async function loadUsers() {
  const data = await readJSON(usersFile);

  if (!data || !Array.isArray(data.users)) {
    const defaultAdmin = {
      email: "marcjohncastillon18@gmail.com",
      passwordHash: "$2b$10$m2istjP8LfZjzYGYTuBVJuBr8T6q4Pn5gPc2nvLbCMBOyRLPofn8W",
      role: "admin"
    };

    await writeJSON(usersFile, { users: [defaultAdmin] });
    return [defaultAdmin];
  }

  return data.users;
}


// --- LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password." });

  if (!loginAttempts[email]) loginAttempts[email] = { count: 0, lockUntil: 0 };
  const attempts = loginAttempts[email];

  if (Date.now() < attempts.lockUntil)
    return res.status(403).json({
      message: "Too many failed attempts. Wait 5 minutes.",
      lockUntil: attempts.lockUntil,
    });

  const users = await loadUsers();
  const user = users.find((u) => u.email === email);
  const errorMsg = { message: "Invalid email or password." };

  if (!user) {
    attempts.count++;
    return res.status(401).json(errorMsg);
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

// ===== BREVO EMAIL SYSTEM =====
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
  sendEmail.sender = { name: "Mj Castillon", email: "marcjohncastillon18@gmail.com" };
  sendEmail.to = recipients.map((email) => ({ email }));
  sendEmail.subject = subject;
  sendEmail.htmlContent = `<h2>${subject}</h2><p>${content}</p>`;

  return await apiInstance.sendTransacEmail(sendEmail);
}

app.post("/api/announcements", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const recipients = await readEmailList();
    if (recipients.length === 0)
      return res.status(500).json({ success: false, message: "No recipients found" });

    await sendAnnouncementEmail(`New Announcement: ${title}`, content, recipients);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Email sending error" });
  }
});

// ===== ATTENDANCE =====
app.post("/api/attendance", async (req, res) => {
  const { id_number } = req.body;
  if (!id_number)
    return res.status(400).json({ message: "Missing ID number." });

  const studentsData = await readJSON(studentsFile);
  if (!studentsData?.members)
    return res.status(500).json({ message: "Students data missing." });

  const student = studentsData.members.find((s) => s.id_number === id_number);
  if (!student)
    return res.status(404).json({ message: "Student not found." });

  const attendance = (await readJSON(attendanceFile)) || [];
  const now = new Date();
  const timestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

  const record = { ...student, timestamp };
  attendance.push(record);
  await writeJSON(attendanceFile, attendance);

  res.json(record);
});

app.get("/api/attendance", async (req, res) => {
  const data = await readJSON(attendanceFile);
  res.json(data || []);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// Root
app.get("/", (req, res) => {
  res.send("Backend running on Render ✔ Login, Attendance, Announcements");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
