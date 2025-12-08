// src/api.js
const API = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function sendAttendance(id_number) {
  const res = await fetch(`${API}/api/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_number }),
  });
  return res.json();
}

export async function getAttendance() {
  const res = await fetch(`${API}/api/attendance`);
  return res.json();
}

export async function sendAnnouncement(title, content) {
  const res = await fetch(`${API}/api/announcements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  return res.json();
}
