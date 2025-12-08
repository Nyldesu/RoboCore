// src/api.js
const API = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),  // <-- IMPORTANT
  });

  return res.json();
}
// Send attendance
export async function sendAttendance({ id_number, timestamp }) {
  const res = await fetch(`${API}/api/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_number, timestamp }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Server error");
  }

  return res.json(); // must return full student record
}


// Get attendance records
export async function getAttendance() {
  const res = await fetch(`${API}/api/attendance`);
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}

// Send announcement
export async function sendAnnouncement(title, content) {
  const res = await fetch(`${API}/api/announcements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error("Failed to send announcement");
  return res.json();
}
