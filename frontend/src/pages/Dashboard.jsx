import { useState, useEffect } from "react";
import AttendanceList from "../components/AttendanceList";
import AttendanceChecker from "../components/AttendanceChecker";
import { getAttendance, sendAnnouncement } from "../api.js";




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
        const data = await sendAnnouncement(title, content);
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
    const fetchAttendance = async () => {
      try {
        const data = await getAttendance();
        setAttendanceRecords(data);
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
    };
    fetchAttendance();
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
