import { useState } from "react";
import AttendanceList from "../components/AttendanceList";
import AttendanceChecker from "../components/AttendanceChecker";
import { sendAnnouncement } from "../api.js";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("announcement");

  // Announcement states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 🔑 trigger attendance refresh
  const [refreshKey, setRefreshKey] = useState(0);

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
        setMessage({ type: "success", text: "Announcement sent successfully!" });
        setTitle("");
        setContent("");
      } else {
        setMessage({ type: "error", text: "Failed to send announcement." });
      }
    } catch {
      setMessage({ type: "error", text: "Server error." });
    } finally {
      setLoading(false);
    }
  };

  // 🔑 called after QR scan
  const handleScanComplete = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab("list");
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
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-[#48A6A7] text-[#006A71]"
                : "text-gray-600 hover:text-[#48A6A7]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcement */}
      {activeTab === "announcement" && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-[#006A71]">
            Create Announcement
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border px-4 py-2 rounded h-32"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-[#006A71] hover:bg-[#48A6A7]"
              }`}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center ${
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

      {/* Attendance Checker */}
      {activeTab === "attendance" && (
        <AttendanceChecker onScanComplete={handleScanComplete} />
      )}

      {/* Attendance List */}
      {activeTab === "list" && (
        <AttendanceList refreshKey={refreshKey} />
      )}
    </div>
  );
}
