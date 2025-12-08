/* npm install @getbrevo/brevo dotenv bcrypt jsonwebtoken express cors body-parser */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs/promises"; // async fs
import path from "path";
import { fileURLToPath } from "url";
import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = 5000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JSON helpers
async function readJSON(file) {
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading file:", file, err);
    return null;
  }
}

async function writeJSON(file, data) {
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error writing file:", file, err);
  }
}

// Users
const usersFile = path.join(__dirname, "users.json");

async function loadUsers() {
  const data = await readJSON(usersFile);
  return data?.users || [];
}

// Login limits
let loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000;

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password." });
  }

  if (!loginAttempts[email]) loginAttempts[email] = { count: 0, lockUntil: 0 };
  const attempts = loginAttempts[email];

  // Lockout check
  if (Date.now() < attempts.lockUntil) {
    return res.status(403).json({
      message: "Too many failed attempts. Account locked for 5 minutes.",
      lockUntil: attempts.lockUntil, 
    });
  }

  const users = await loadUsers();
  const user = users.find((u) => u.email === email);

  const genericError = { message: "Invalid email or password." };

  // User does not exist, increment fake attempts
  if (!user) {
    attempts.count++;
    return res.status(401).json(genericError);
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    attempts.count++;

    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.count = 0;
      attempts.lockUntil = Date.now() + LOCKOUT_TIME;
      return res.status(403).json({
        message: "Too many failed attempts. Account locked for 5 minutes.",
        lockUntil: attempts.lockUntil,
      });
    }

    return res.status(401).json({
      message: "Invalid email or password.",
      attemptsLeft: MAX_ATTEMPTS - attempts.count,
    });
  }

  // Reset attempts on successful login
  attempts.count = 0;
  attempts.lockUntil = 0;

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    success: true,
    role: user.role,
    token,
  });
});

// Brevo email system
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const emailsJSON = path.join(__dirname, "emails.json");

async function readEmailList() {
  const data = await readJSON(emailsJSON);
  return data?.emails || [];
}

async function sendAnnouncementEmail(subject, content, recipients) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: "Mj Castillon",
    email: "marcjohncastillon18@gmail.com",
  };
  sendSmtpEmail.to = recipients.map((email) => ({ email }));
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `<h2>${subject}</h2><p>${content}</p>`;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent:", data.body);
    return true;
  } catch (error) {
    console.error("❌ Brevo Error:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
}

// Announcement route
app.post("/api/announcements", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const recipients = await readEmailList();
    if (recipients.length === 0) {
      return res.status(500).json({ success: false, message: "No recipients found" });
    }

    await sendAnnouncementEmail(`New Announcement: ${title}`, content, recipients);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Attendance system
const studentsFile = path.join(__dirname, "students.json");
const attendanceFile = path.join(__dirname, "attendance.json");

app.post("/api/attendance", async (req, res) => {
  const { id_number } = req.body;
  if (!id_number) return res.status(400).json({ message: "Missing ID number." });

  const studentsData = await readJSON(studentsFile);
  if (!studentsData?.members)
    return res.status(500).json({ message: "Students data missing." });

  const student = studentsData.members.find((s) => s.id_number === id_number);
  if (!student) return res.status(404).json({ message: "Student not found." });

  const attendance = (await readJSON(attendanceFile)) || [];
  const now = new Date();
  const localTimestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

  const record = { ...student, timestamp: localTimestamp };
  attendance.push(record);
  await writeJSON(attendanceFile, attendance);

  console.log("✅ Attendance recorded:", record.full_name);
  res.json(record);
});

app.get("/api/attendance", async (req, res) => {
  const attendance = (await readJSON(attendanceFile)) || [];
  res.json(attendance);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// HTTPS enforcement
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.status(403).send("Use HTTPS");
  }
  next();
});

// Root
app.get("/", (req, res) => {
  res.send("Server running securely: Login + Attendance + Announcements");
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
