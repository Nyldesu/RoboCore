import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function AttendanceChecker() {
  const [scanOn, setScanOn] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [error, setError] = useState(null);
  const [studentIdError, setStudentIdError] = useState(null);

  const html5QrcodeScannerRef = useRef(null);
  const qrRegionId = "qr-region";

  useEffect(() => {
    if (scanOn) {
      html5QrcodeScannerRef.current = new Html5Qrcode(qrRegionId);

      html5QrcodeScannerRef.current
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            setStudentId(decodedText);
            setError(null);
            if (decodedText.length >= 8 && decodedText.length <= 9) {
              setStudentIdError(null);
            } else {
              setStudentIdError("Scanned ID must be 8-9 characters.");
            }
          },
          (errorMessage) => {
            // Optionally handle scan errors here
          }
        )
        .catch((err) => {
          setError("Camera start failed: " + err);
          setScanOn(false);
        });
    } else {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current
          .stop()
          .then(() => html5QrcodeScannerRef.current.clear())
          .catch((e) => console.error("Stop error:", e))
          .finally(() => {
            html5QrcodeScannerRef.current = null;
          });
      }
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current
          .stop()
          .then(() => html5QrcodeScannerRef.current.clear())
          .catch((e) => console.error("Cleanup error:", e))
          .finally(() => {
            html5QrcodeScannerRef.current = null;
          });
      }
    };
  }, [scanOn]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#006A71]">Attendance Checker</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (studentId.length < 8 || studentId.length > 9) {
            setStudentIdError("Student ID must be 8 to 9 characters.");
            return;
          }
          setStudentIdError(null);
          alert("Submit button clicked! (No backend hooked up)");
          setStudentId("");
        }}
        className="space-y-4"
      >
        {/* Date & Time */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-1 font-medium text-sm">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col w-full md:w-1/2">
            <label className="mb-1 font-medium text-sm">Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Student ID */}
        <div>
          <label className="mb-1 font-medium text-sm">Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 9) {
                setStudentId(val);
                if (val.length >= 8) {
                  setStudentIdError(null);
                }
              }
            }}
            placeholder="Scan QR or type manually"
            className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#9ACBD0] ${
              studentIdError ? "border-red-500" : ""
            }`}
          />
          {studentIdError && (
            <p className="text-red-600 text-sm mt-1">{studentIdError}</p>
          )}
        </div>

        {/* Camera toggle */}
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={scanOn}
            onChange={() => {
              setScanOn((prev) => !prev);
              setError(null);
              setStudentId("");
              setStudentIdError(null);
            }}
          />
          <span>{scanOn ? "Turn off Camera" : "Turn on Camera"}</span>
        </label>

        {/* QR Scanner region */}
        {scanOn && (
          <div
            id={qrRegionId}
            className="w-full max-w-xs mx-auto mb-4 rounded overflow-hidden shadow-lg"
          />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#006A71] text-white px-6 py-2 rounded hover:bg-[#48A6A7] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
