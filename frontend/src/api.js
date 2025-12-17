// src/api.js
const API = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw data;
  }

  return await res.json();
}

// Send attendance
export async function sendAttendance({ id_number, timestamp }) {
  const res = await fetch(`${API}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    },
    body: JSON.stringify({ id_number, timestamp }), // <-- IMPORTANT
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json(); // must return full student record
}

// Get attendance records
export async function getAttendance() {
  const res = await fetch(`${API}/attendance`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

// Semd announcement
export async function sendAnnouncement(title, content) {
  const res = await fetch(`${API}/announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}
