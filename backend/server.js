/* npm install @getbrevo/brevo dotenv */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 5000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Admin user
const USER = {
  username: "100-00001",
  password: "admin",
};

// Initialize Brevo API using environment variable
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY // <- from .env
);

// Load email list
const emailsJSON = path.join(__dirname, "emails.json");
function readEmailList() {
  try {
    const data = fs.readFileSync(emailsJSON, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.emails || [];
  } catch (err) {
    console.error("❌ Error reading emails.json:", err);
    return [];
  }
}

// Send announcement emails
async function sendAnnouncementEmail(subject, content, recipients) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: "Mj Castillon", email: "marcjohncastillon18@gmail.com" };
  sendSmtpEmail.to = recipients.map((email) => ({ email }));
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `<h2>${subject}</h2><p>${content}</p>`;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", data.body);
    return true;
  } catch (error) {
    console.error("❌ Brevo API error:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
}

// Endpoint to send announcement
app.post("/api/announcements", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ success: false, message: "Missing fields" });
  // Read email list
  try {
    const recipients = readEmailList();

    if (recipients.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No recipient emails found in emails.json",
      });
    }

    await sendAnnouncementEmail(
      `New Announcement: ${title}`,
      content,
      recipients
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// Attendance files
const studentsFile = path.join(__dirname, "students.json");
const attendanceFile = path.join(__dirname, "attendance.json");

// Read JSON safely
function readJSON(file) {
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading file:", file, err);
    return null;
  }
}

// Write JSON safely
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error writing file:", file, err);
  }
}

// Record attendance
// Record attendance
app.post("/api/attendance", (req, res) => {
  const { id_number } = req.body;
  if (!id_number) return res.status(400).json({ message: "Missing ID number." });

  const studentsData = readJSON(studentsFile);
  if (!studentsData || !studentsData.members)
    return res.status(500).json({ message: "Students data not found." });

  const student = studentsData.members.find((s) => s.id_number === id_number);
  if (!student) return res.status(404).json({ message: "Student not found." });

  const attendance = readJSON(attendanceFile) || [];

  // ✅ Convert current time to local ISO string
  const now = new Date();
  const localTimestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

  const record = {
    ...student,
    timestamp: localTimestamp,
  };

  attendance.push(record);
  writeJSON(attendanceFile, attendance);

  console.log("✅ Attendance recorded:", record.full_name);
  res.json(record);
});

// Retrieve attendance
app.get("/api/attendance", (req, res) => {
  const attendance = readJSON(attendanceFile) || [];
  res.json(attendance);
});

// Admin login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.json({ success: true, role: "admin" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is working with Attendance + Announcement Email!");
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running with ALL FEATURES at http://localhost:${PORT}`)
);
