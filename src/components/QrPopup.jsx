import React, { useEffect } from 'react';
import './qr.css';
import { IoCameraOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";

function QrPopup({isOpen, onClose}){
  useEffect(() =>{
    if(isOpen){
      document.body.style.overflow = 'hidden';
    }else{
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if(!isOpen) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className='popupOverlay' onClick={onClose}>
      <div className='popupContainer' onClick={stopPropagation}>
        <button className='popupClose' onClick={onClose}>X</button>
        <h2>Tap & Scan Qr Code</h2>
        <div className='buttonContainers'>
          <div className='cameraContainer'>
            <div className='circleQr'>
              <IoCameraOutline/>
            </div>
            <label>CAMERA</label>
          </div>
          <div className='listContainer'> 
            <div className='circleQr'>
              <LuNotebookPen/>
            </div>
            <label>LIST</label>
          </div>
        </div>
      </div>
    </div>
  );

}

export default QrPopup;