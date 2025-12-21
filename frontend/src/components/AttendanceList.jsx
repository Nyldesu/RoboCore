import React, { useEffect, useState } from "react";
import { getAttendance } from "../api.js";
import { downloadAttendanceExcel } from "../api.js";


const AttendanceList = ({ refreshKey }) => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterDate, setFilterDate] = useState(getTodayISO());
  const [loading, setLoading] = useState(true);

  function getTodayISO() {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().split("T")[0];
  }

  const formatRecord = (rec) => {
    const dateObj = new Date(rec.timestamp);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return {
      ...rec,
      isoDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      date: `${month}/${day}/${year}`,
      time: `${displayHour}:${minutes} ${ampm}`,
    };
  };

  // ✅ SINGLE source of truth: backend
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const data = await getAttendance();
        setAllRecords((data || []).map(formatRecord));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [refreshKey]);

  useEffect(() => {
    setFilteredRecords(
      allRecords.filter((rec) => rec.isoDate === filterDate)
    );
  }, [allRecords, filterDate]);

  const handleDateChange = (e) => setFilterDate(e.target.value);

const handleDownload = async () => {
  try {
    const blob = await downloadAttendanceExcel(filterDate);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${filterDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-[#006A71] mb-6">
        Attendance Records
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <p className="text-gray-700 font-medium">
          Total Present:{" "}
          <span className="font-semibold">{filteredRecords.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button onClick={handleDownload} 
            className="px-4 py-2 bg-[#006A71] text-white rounded hover:bg-[#48A6A7]">
            Download Excel
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Loading attendance...
        </p>
      )}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-indigo-100 text-[#006A71]">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">ID Number</th>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border text-center">Program</th>
                <th className="px-4 py-2 border text-center">Year</th>
                <th className="px-4 py-2 border text-center">Date</th>
                <th className="px-4 py-2 border text-center">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No records found for this date.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, i) => (
                  <tr key={rec.id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{i + 1}</td>
                    <td className="px-4 py-2 border">{rec.id_number}</td>
                    <td className="px-4 py-2 border">{rec.full_name}</td>
                    <td className="px-4 py-2 border text-center">{rec.program}</td>
                    <td className="px-4 py-2 border text-center">{rec.year}</td>
                    <td className="px-4 py-2 border text-center">{rec.date}</td>
                    <td className="px-4 py-2 border text-center">{rec.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
