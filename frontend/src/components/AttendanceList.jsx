import React, { useEffect, useState } from "react";

const AttendanceList = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterDate, setFilterDate] = useState(getTodayISO());
  const [loading, setLoading] = useState(true);

  // Function to get today's date in YYYY-MM-DD
  function getTodayISO() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch attendance data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/attendance");
        const data = await res.json();

        const formattedData = data.map((rec) => {
          const dateObj = new Date(rec.timestamp);

          const year = dateObj.getUTCFullYear();
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getUTCDate()).padStart(2, "0");
          const hours = dateObj.getUTCHours();
          const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "PM" : "AM";
          const displayHour = hours % 12 === 0 ? 12 : hours % 12;

          return {
            ...rec,
            isoDate: `${year}-${month}-${day}`,
            date: `${month}/${day}/${year}`,
            time: `${displayHour}:${minutes} ${ampm}`,
          };
        });

        setAllRecords(formattedData);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter records whenever allRecords or filterDate changes
  useEffect(() => {
    const filtered = allRecords.filter((rec) => rec.isoDate === filterDate);
    setFilteredRecords(filtered);
  }, [allRecords, filterDate]);

  // Always keep filterDate as today by default
  const handleDateChange = (e) => setFilterDate(e.target.value);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-[#006A71] mb-6">
        Attendance Records
      </h1>

      {/* Total Present + Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <p className="text-gray-700 font-medium">
          Total Present: <span className="font-semibold">{filteredRecords.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading attendance...</p>}

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
                  <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                    No records found for this date.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
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
