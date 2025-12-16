
import "../css/About.css";
import robleft from '../assets/robot-l.png'
import robright from '../assets/robot-r.png'
import adv from '../assets/adviser.png'
import pres from '../assets/president.png'

export default function About() {
  return (
    <div className="about-container">
      <div className="image-section-wrapper">
        <img src={robleft} alt="Robot" className="robot-img-left" />
        <section className="section half-width">
          <div className="half-section">
            <h2 className="section-title">About RoboCore</h2>
            <p className="section-text">
              RoboCore is a web-based platform created to streamline the operations of the Robotics Enthusiasts Club. It makes access a lot more better to schedules and announcements. Our goal is to help the club stay organized and connected using simple digital tools.
            </p>
          </div>
        </section>
      </div>
      <div className="image-section-wrapper">
        <section className="section half-width">
          <div className="half-section">
            <h2 className="section-title">About Robotics Enthusiasts Club</h2>
            <p className="section-text">
              The Robotics Enthusiasts Club of Caraga State University is a student-led organization passionate about exploring the world of robotics, artificial intelligence, and machine learning. We aim to create a space where curious minds can learn, build, and innovate through hands-on projects, workshops, and competitions. Whether you're a beginner or already deep into code and circuits, our community is all about sharing knowledge, growing skills, and pushing the boundaries of what technology can do. If you're excited about the future of intelligent machines — this is the place to be.
            </p>
          </div>
        </section>
        <img src={robright} alt="Robot" className="robot-img-right" />
      </div>
      <section className="section mbox">
        <h2 className="title section-title">Meet Our Leaders</h2>
        <div className="leaders-grid">
          <div className="leader-card">
            <img src={pres} alt="President" className="leader-img" />
            <h3 className="leader-title">President</h3>
            <p className="leader-name">Chel Mary Joy Balbada</p>
            <p className="leader-desc">Leads the Robotics Enthusiasts Club and helps members work together and be creative.</p>
          </div>
          <div className="leader-card">
            <img src={adv} alt="Adviser" className="leader-img" />
            <h3 className="leader-title">Adviser</h3>
            <p className="leader-name">Engr. Rudolph Joshua U. Candare, MSc</p>
            <p className="leader-desc">Gives guidance and support to help the club and its members grow and succeed.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
