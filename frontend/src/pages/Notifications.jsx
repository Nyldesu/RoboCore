/* 
Install this:

npm install react-calendar      # Calendar component for React
npm install date-fns            # Date utility functions (formatting, parsing, comparing)
npm install framer-motion       # Animation library (optional, for fade-in effects) 
*/

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/Notif.css";
import { format, parseISO, isSameDay } from "date-fns";

function hasNotification(date, notifications) {
  return notifications.some(({ datetime }) => isSameDay(parseISO(datetime), date));
}

const notifications = [
  { text: "Robotics Workshop Kickoff", datetime: "2025-05-05T14:00:00" },
  { text: "Club Meeting and Planning Session", datetime: "2025-05-12T16:30:00" },
  { text: "Tech Talk: AI in Everyday Life", datetime: "2025-05-18T10:00:00" },
  { text: "Field Trip to Science Museum", datetime: "2025-05-22T09:00:00" },
  { text: "End-of-Month Social Gathering", datetime: "2025-05-28T18:00:00" },
];

export default function Notifications() {
  const [date, setDate] = useState(new Date());
  const [showAll, setShowAll] = useState(true); 
  const today = format(new Date(), "MMMM dd, yyyy");

  const displayedNotifications = showAll
    ? notifications
    : notifications.filter(({ datetime }) => isSameDay(parseISO(datetime), date));

  return (
    <div className="notif-container">
      <div className="notif-grid">
        <div className="calendar-box">
          <h2 className="calendar-title">Today: {today}</h2>
          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
              setShowAll(false);
            }}
            value={date}
            tileContent={({ date: calendarDate, view }) =>
              view === "month" && hasNotification(calendarDate, notifications) ? (
                <div className="dot-indicator" />
              ) : null
            }
          />
        </div>

        <div className="notif-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="notif-title">
              {showAll
                ? `All Notifications (${notifications.length})`
                : `Notifications for ${format(date, "MMMM dd, yyyy")}`}
            </h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className={`px-4 py-1 mb-2 font-semibold border rounded cursor-pointer ${
              showAll
              ? "bg-[#48A6A7] text-white border-[#48A6A7]"
              : "bg-white text-[#48A6A7] border-[#48A6A7]"
              }`}
              >
              {showAll ? "View By Date" : "View All"}
            </button>

          </div>

          <div className="notif-scroll">
            {displayedNotifications.length === 0 ? (
              <p className="no-notif">No notifications to display.</p>
            ) : (
              <ul>
                {displayedNotifications.map(({ text, datetime }, idx) => {
                  const dateObj = parseISO(datetime);
                  return (
                    <li key={idx} className="notif-item">
                      <div className="notif-text">{text}</div>
                      <div className="notif-datetime">
                        {format(dateObj, "MMMM dd, yyyy hh:mm a")}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
