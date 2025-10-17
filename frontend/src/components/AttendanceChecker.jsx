import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = ({ onScanComplete }) => {
  const [idNumber, setIdNumber] = useState("");
  const scannerRef = useRef(null); // prevent double init

  useEffect(() => {
    if (scannerRef.current) return; // ✅ prevent multiple instances

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setIdNumber(decodedText);
        scanner.clear();
        scannerRef.current = null; // reset ref after clear
      },
      (error) => console.warn("QR error:", error)
    );

    scannerRef.current = scanner;

    // ✅ Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  // ✅ Handle manual submit
  const handleSubmit = async () => {
    if (!idNumber.trim()) {
      alert("Please scan or enter an ID number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_number: idNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`⚠️ ${errorData.message || "Server error"}`);
        return;
      }

      const data = await response.json();
      alert(`✅ ${data.full_name} recorded successfully.`);

      onScanComplete(data);
      setIdNumber("");
    } catch (error) {
      console.error("Server error:", error);
      alert("⚠️ Server error. Please check your backend.");
    }
  };

  return (
    <div className="scanner-container" style={{ textAlign: "center" }}>
      <h2>QR Attendance Scanner</h2>

      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>

      <input
        type="text"
        placeholder="Scan or enter ID number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          marginTop: "10px",
          fontSize: "16px",
        }}
      />

      <br />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "8px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default QrScanner;
