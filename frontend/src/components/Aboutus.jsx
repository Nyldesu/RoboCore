import React from 'react';
import '../css/Aboutus.css';

function AboutUs() {
  return (
    <div className="about-container">
        <div className="header">
          <div className="about-header">
            <h2>A</h2><h2>B</h2><h2>O</h2><h2>U</h2><h2>T</h2>
            <h2></h2><h2>R</h2><h2>O</h2><h2>B</h2><h2>O</h2>
            <h2>C</h2><h2>O</h2><h2>R</h2><h2>E</h2>
          </div>
          <div className="line"></div>
        </div>  
        <div className="card-container">
          <div className="container-1">
              <img src="left.png" alt="" />
            <div className="half">
              <h2>RoboCore</h2>
              <p>RoboCore is a web-based platform created to streamline the operations of the Robotics Enthusiasts Club. It makes access a lot more better to schedules and announcements. Our goal is to help the club stay organized and connected using simple digital tools.
</p>
              </div>
          </div>
          <div className="container-2">
            <div className="half">
              <h2>CSU - Robotics Enthusiats Club</h2>
              <p>The Robotics Enthusiasts Club of Caraga State University is a student-led organization passionate about exploring the world of robotics, artificial intelligence, and machine learning. We aim to create a space where curious minds can learn, build, and innovate through hands-on projects, workshops, and competitions. Whether you're a beginner or already deep into code and circuits, our community is all about sharing knowledge, growing skills, and pushing the boundaries of what technology can do. If you're excited about the future of intelligent machines — this is the place to be.</p>
            </div>
            <img src="right.png" alt="" />
          </div>
        </div>
    </div>
  );
};

export default AboutUs;
