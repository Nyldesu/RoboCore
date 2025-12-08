import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { sendAttendance } from "../api.js"; // ✅ import it

const QrScanner = ({ onScanComplete }) => {
  const [idNumber, setIdNumber] = useState("");
  const scannerRef = useRef(null); // prevent double init

  useEffect(() => {
    if (scannerRef.current) return; // prevent multiple instances

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setIdNumber(decodedText);
        scanner.clear();
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
    if (!idNumber.trim()) {
      return alert("Please scan or enter an ID number.");
    }

    try {
      const timestamp = new Date().toISOString();
      // sendAttendance expects an object with id_number and timestamp
      const data = await sendAttendance({ id_number: idNumber, timestamp });

      if (!data.full_name) {
        throw new Error("Server error");
      }

      alert(`✅ ${data.full_name} recorded successfully.`);
      onScanComplete(data);
      setIdNumber("");
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error. Check backend.");
    }
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
        className="border border-gray-300 rounded px-3 py-2 mt-4 w-full focus:outline-none focus:ring-2 focus:ring-[#006A71]"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#006A71] text-white px-6 py-2 rounded shadow hover:bg-[#48A6A7] focus:outline-none focus:ring-2 focus:ring-[#006A71]"
      >
        Submit
      </button>
    </div>
  );
};

export default QrScanner;
