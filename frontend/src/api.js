// src/api.js
const API = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw data;
  }

  return await res.json();
}

export async function sendAttendance(id_number) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("User is not logged in.");

  const res = await fetch(`${API}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_number }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Failed to record attendance.");

  return data; // Should include `student` and `timestamp`
}

export async function getAttendance() {
  const token = localStorage.getItem("authToken") || "";
  const res = await fetch(`${API}/attendance`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json(); // Returns array of attendance records
}
// Send announcement
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

export const downloadAttendanceExcel = async (date) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/attendance/export?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to download");

  const blob = await res.blob();
  return blob;
};
