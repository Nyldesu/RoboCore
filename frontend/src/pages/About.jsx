
import "../css/About.css";
import robleft from '../assets/robot-l.png'
import robright from '../assets/robot-r.png'

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
    </div>
  );
}
