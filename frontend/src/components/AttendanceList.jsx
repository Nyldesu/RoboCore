import React from "react";

const AttendanceList = ({ records }) => {
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h2>Attendance Records</h2>
      {records.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ margin: "auto", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID Number</th>
              <th>Full Name</th>
              <th>Program</th>
              <th>Year</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index}>
                <td>{rec.id_number}</td>
                <td>{rec.full_name}</td>
                <td>{rec.program}</td>
                <td>{rec.year}</td>
                <td>{rec.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceList;
