import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const ATTENDANCE_FILE = path.resolve('attendanceList.json');

// Helper function to safely read the JSON file
function readJSON(file) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]', 'utf8');
    }
    const data = fs.readFileSync(file, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('❌ Error reading file:', err);
    return [];
  }
}

// POST - Record attendance
router.post('/', (req, res) => {
  const { idNumber, name } = req.body;
  if (!idNumber || !name) {
    return res.status(400).json({ error: 'Missing ID number or name.' });
  }

  const attendance = readJSON(ATTENDANCE_FILE);
  const record = {
    idNumber,
    name,
    time: new Date().toLocaleString()
  };

  attendance.push(record);
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(attendance, null, 2), 'utf8');
  console.log(`✅ Attendance recorded: ${name}`);

  res.json({ success: true, message: `${name} recorded successfully.` });
});

// GET - Fetch all attendance records
router.get('/', (req, res) => {
  const attendance = readJSON(ATTENDANCE_FILE);
  res.json(attendance);
});

export default router;
