import React, { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import "./styles/explore.css";
import { LuQrCode } from "react-icons/lu";
import { IoMegaphoneOutline } from "react-icons/io5";
import AnnouncementPopUp from "./components/announcementPopUp";
import QrPopup from "./components/qRPopUp";
import CalendarPopup from "./components/calendarPopup";

function ExploreTest() {
  const [PopUp, setPopUp] = useState(false);
  const [qrModal, setqrModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);

  const toggleqrPopup = () => {
    setqrModal(!qrModal);
  };

  const togglePopUp = () => {
    setPopUp(!PopUp);
  };

  const toggleCalendar = () => {
    setCalendarModal(!calendarModal);
  };

  return (
    <>
      <section id="Explore">
        <div className="exploreContainer">
          <h1 className="title">EXPLORE</h1>
          <div className="lineContainer"></div>
          <div className="cardContainer">
            <div className="card" onClick={toggleqrPopup}>
              <div className="circle">
                <LuQrCode className="icon" />
              </div>
              <h2>ATTENDANCE CHECKER</h2>
            </div>

            <div className="card" onClick={togglePopUp}>
              <div className="circle">
                <IoMegaphoneOutline className="icon" />
              </div>
              <h2>CREATE ANNOUNCEMENT</h2>
            </div>

            <div className="card" onClick={toggleCalendar}>
              <div className="circle">
                <MdOutlineCalendarMonth className="icon" />
              </div>
              <h2>VIEW CALENDAR</h2>
            </div>
          </div>
        </div>
        <div className="custom-shape-divider-bottom-1746258221">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      <CalendarPopup
        isOpen={calendarModal}
        onClose={() => setCalendarModal(false)}
      />
      <QrPopup isOpen={qrModal} onClose={() => setqrModal(false)} />
      <AnnouncementPopUp isOpen={PopUp} onClose={() => setPopUp(false)} />
    </>
  );
}

export default ExploreTest;
