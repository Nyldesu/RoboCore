import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { sendAttendance } from "../api.js";

const AttendanceChecker = ({ onScanComplete }) => {
  const [idNumber, setIdNumber] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const scannerRef = useRef(null);

  // Initialize QR scanner
  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      (decodedText) => {
        setIdNumber(decodedText);
        scanner.clear().catch(() => {});
        scannerRef.current = null;
      },
      (error) => console.warn("QR error:", error)
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!idNumber.trim()) return alert("Please scan or enter an ID number.");

    try {
      const data = await sendAttendance(idNumber.trim());
      const student = data.student;
      const timestamp = data.timestamp;

      setStudentInfo({ ...student, timestamp });

      if (onScanComplete) {
        onScanComplete({ ...student, timestamp });
      }

      alert(`✅ Attendance recorded for ${student.full_name}`);
      setIdNumber("");
    } catch (err) {
      console.error("Attendance API error:", err);
      alert(err.message || "Failed to record attendance.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="scanner-container p-6 bg-white rounded-xl shadow-md max-w-md mx-auto text-center">
      <h2 className="text-2xl font-semibold text-[#006A71] mb-4">
        QR Attendance Scanner
      </h2>

      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>

      <input
        type="text"
        placeholder="Scan or enter ID number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-3 py-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-[#006A71]"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#006A71] text-white px-6 py-2 rounded shadow hover:bg-[#48A6A7] focus:outline-none focus:ring-2 focus:ring-[#006A71]"
      >
        Submit
      </button>

      {studentInfo && (
        <div className="mt-4 text-left bg-green-50 p-3 rounded border border-green-200">
          <p><strong>Name:</strong> {studentInfo.full_name}</p>
          <p><strong>ID Number:</strong> {studentInfo.id_number}</p>
          <p><strong>Program:</strong> {studentInfo.program}</p>
          <p><strong>Year:</strong> {studentInfo.year}</p>
          <p><strong>Time:</strong> {new Date(studentInfo.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChecker;
