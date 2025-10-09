import { useState } from "react";
import AttendanceList from "../components/AttendanceList";
import AttendanceChecker from "../components/AttendanceChecker";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("announcement");

  return (
    <div className="p-4">
      {/* Tab Header */}
      <div className="flex space-x-6 mb-4">
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "announcement"
              ? "border-b-2 border-[#48A6A7] text-[#006A71]"
              : "text-gray-600 hover:text-[#48A6A7]"
          }`}
          onClick={() => setActiveTab("announcement")}
        >
          Create Announcement
        </button>
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "event"
              ? "border-b-2 border-[#48A6A7] text-[#006A71]"
              : "text-gray-600 hover:text-[#48A6A7]"
          }`}
          onClick={() => setActiveTab("event")}
        >
          Create Event
        </button>
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "attendance"
              ? "border-b-2 border-[#48A6A7] text-[#006A71]"
              : "text-gray-600 hover:text-[#48A6A7]"  
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance Checker
        </button>
                <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "list"
              ? "border-b-2 border-[#48A6A7] text-[#006A71]"
              : "text-gray-600 hover:text-[#48A6A7]"
          }`}
          onClick={() => setActiveTab("list")}
        >
          Attendance List
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "announcement" && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mb-8">
  <h1 className="text-2xl font-bold text-[#006A71] mb-4">Create Announcement</h1>

  <form className="space-y-4">
    <input
      type="text"
      placeholder="Announcement Title"
      className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
    />
    <textarea
      placeholder="Announcement Details"
      className="w-full h-32 px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
    />
    <button type="submit" className="bg-[#006A71] text-white px-6 py-2 rounded hover:bg-[#48A6A7] transition">
      Submit
    </button>
  </form>
</div>
      )}
      
      {activeTab === "event" && (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-[#006A71]">Create Event</h1>

          <form className="space-y-4">
    {/* Time & Date Row */}
            <div className="flex flex-wrap md:flex-nowrap gap-4 timeDateContainer">
              <div className="flex flex-col inputGroup w-full">
                <label className="mb-1 text-sm font-medium text-gray-700">Set Date:</label>
                <input type="date" className="border border-gray-300 
                rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>

              <div className="flex flex-col inputGroup w-full">
                <label className="mb-1 text-sm font-medium text-gray-700">Set Time In:</label>
                <input type="time" className="border border-gray-300 
                rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>

              <div className="flex flex-col inputGroup w-full">
                <label className="mb-1 text-sm font-medium text-gray-700">Set Time Out:</label>
                <input type="time" className="border border-gray-300 
                rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
              </div>
            </div>

    {/* Event Title */}
         <input type="text" placeholder="Event Title" className="w-full border 
          border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"/>

    {/* Description */}
        <textarea placeholder="Description" className="w-full h-32 border 
          border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 
            descriptionContainer"></textarea>

    {/* Submit Button */}
        <button type="submit" className="bg-[#006A71] text-white px-6 py-2 rounded hover:bg-[#48A6A7] transition">Save
        </button>
      </form>
    </div>

      )}

      {activeTab === "attendance" && (
        <div>
          <AttendanceChecker />
        </div>
      )}

      {activeTab === "list" && (
        <div>
          <AttendanceList/>
        </div>
      )}

    </div>
  );
}
