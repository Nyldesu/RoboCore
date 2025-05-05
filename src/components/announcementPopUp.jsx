import React, { useEffect } from 'react';
import './announcement.css';

function AnnouncementPopUp({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // disable scroll
    } else {
      document.body.style.overflow = 'auto'; // enable scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // cleanup
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Prevent clicks inside the popup from closing it
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={stopPropagation}>
        <button className="popupClose" onClick={onClose}>X</button>
        <h2>CREATE ANNOUNCEMENT</h2>
        <form>
          <div className='timeDateContainer'>    
            <div className="inputGroup">
              <label>Set Date:</label>   
              <input type="date" placeholder='DD/MM/YYYY'/>
            </div>
            <div className="inputGroup">
              <label>Set Time In:</label> 
              <input type='time'/>
            </div>
            <div className="inputGroup">
              <label>Set Time Out:</label>     
              <input type='time'/>
            </div>
          </div>
          <input type="text" placeholder="Event Title" />
          <textarea placeholder="Description" className='descriptionContainer'></textarea>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default AnnouncementPopUp;
