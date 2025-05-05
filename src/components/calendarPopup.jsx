import React, { useEffect } from 'react';
import './calendar.css'

function CalendarPopup({isOpen, onClose}){
  useEffect(() => {
    if(isOpen){
      document.body.style.overflow = 'hidden';
    }
    else{
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if(!isOpen) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return(
    <div className='popupOverlay' onClick={onClose}>
      <div className='popupContainer' onClick={stopPropagation}>
        <button className='popupClose' onClick={onClose}>X</button>
        <h2>Calendar</h2>
        <div className='calendarContainer'></div>
      </div>
    </div>
  );
}

export default CalendarPopup