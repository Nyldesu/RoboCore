import { useState, useEffect } from "react";
import AttendanceList from "../components/AttendanceList";
import AttendanceChecker from "../components/AttendanceChecker";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("announcement");

  // ---------------------------
  // Announcement form states
  // ---------------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !content) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "✅ Announcement sent successfully!" });
        setTitle("");
        setContent("");
      } else {
        setMessage({ type: "error", text: "❌ Failed to send announcement." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "⚠️ Unable to connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Attendance List
  // ---------------------------
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Load attendance when tab is activated
  useEffect(() => {
    if (activeTab === "list") {
      fetch("http://localhost:5000/api/attendance")
        .then((res) => res.json())
        .then((data) => setAttendanceRecords(data))
        .catch((err) => console.error("Error loading attendance:", err));
    }
  }, [activeTab]);

  // Update list after scan
  const handleScanComplete = (record) => {
    setAttendanceRecords((prev) => [record, ...prev]);
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-6 mb-4">
        {[
          { id: "announcement", label: "Create Announcement" },
          { id: "event", label: "Create Event" },
          { id: "attendance", label: "Attendance Checker" },
          { id: "list", label: "Attendance List" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-[#48A6A7] text-[#006A71]"
                : "text-gray-600 hover:text-[#48A6A7]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------------------------
          ANNOUNCEMENT TAB
      ---------------------------- */}
      {activeTab === "announcement" && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-[#006A71] mb-4">
            Create Announcement
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement Title"
              className="w-full px-4 py-2 border rounded"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement Details"
              className="w-full h-32 px-4 py-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#006A71] hover:bg-[#48A6A7]"
              }`}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      )}

      {/* ---------------------------
          EVENT FORM TAB
      ---------------------------- */}
      {activeTab === "event" && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#006A71] mb-2">Create Event</h1>

          <form className="space-y-4">
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm">Set Date:</label>
                <input type="date" className="border rounded px-3 py-2" />
              </div>

              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm">Set Time In:</label>
                <input type="time" className="border rounded px-3 py-2" />
              </div>

              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm">Set Time Out:</label>
                <input type="time" className="border rounded px-3 py-2" />
              </div>
            </div>

            <input
              type="text"
              placeholder="Event Title"
              className="w-full border rounded px-4 py-2"
            />

            <textarea
              placeholder="Description"
              className="w-full h-32 border rounded px-4 py-2"
            />

            <button
              type="submit"
              className="bg-[#006A71] text-white px-6 py-2 rounded hover:bg-[#48A6A7]"
            >
              Save
            </button>
          </form>
        </div>
      )}

      {/* ---------------------------
          ATTENDANCE CHECKER TAB
      ---------------------------- */}
      {activeTab === "attendance" && (
        <AttendanceChecker onScanComplete={handleScanComplete} />
      )}

      {/* ---------------------------
          ATTENDANCE LIST TAB
      ---------------------------- */}
      {activeTab === "list" && (
        <AttendanceList records={attendanceRecords} />
      )}
    </div>
  );
}
