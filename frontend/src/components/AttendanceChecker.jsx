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
      console.log("Attendance response:", data);

      // If student info exists, show it
      if (data.student) {
        setStudentInfo({ ...data.student, timestamp: data.timestamp });
        alert(`✅ Attendance recorded for ${data.student.full_name}`);
      } else {
        setStudentInfo(null);
        alert("✅ Attendance recorded successfully!");
      }

      // Callback to parent component (AttendanceList)
      if (onScanComplete) {
        const record = data.student
          ? { ...data.student, timestamp: data.timestamp }
          : { id_number: idNumber.trim(), timestamp: data.timestamp || new Date().toISOString() };
        onScanComplete(record);
      }

      setIdNumber(""); // clear input for next scan
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
        pattern="^[0-9]+-[0-9]+$"
        title="Invalid Input."
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
          <p><strong>Timestamp:</strong> {new Date(studentInfo.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChecker;
