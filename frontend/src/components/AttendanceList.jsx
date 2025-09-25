import { useEffect, useState } from "react";
import AttendanceData from "../data/052725/AttendanceData.js";

const AttendanceList = () => {
  const [allRecords, setAllRecords] = useState(AttendanceData);
  const [records, setRecords] = useState(AttendanceData);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (filterDate) {
      const filtered = allRecords.filter((record) => record.date === filterDate);
      setRecords(filtered);
    } else {
      setRecords(allRecords);
    }
  }, [filterDate, allRecords]);

  const addRecord = (newRecord) => {
    setAllRecords((prev) => [...prev, { id: Date.now(), ...newRecord }]);
  };

  const removeRecord = (id) => {
    setAllRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#006A71]">Attendance List</h2>
        <div className="mt-4 md:mt-0">
          <label className="mr-2 font-medium">Filter by Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <p className="mb-2 text-sm text-gray-600">
        Total Present: <span className="font-semibold">{records.length}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-indigo-100 text-[#006A71]">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Student ID</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{record.name_or_id}</td>
                  <td className="px-4 py-2 border">{record.time}</td>
                  <td className="px-4 py-2 border">{record.date}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => removeRecord(record.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
