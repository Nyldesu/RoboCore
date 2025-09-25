import HERO from '../assets/HERO.png'
import '../css/Aboutus.css'
import '../css/Contactus.css'
import left from '../assets/left.png'
import right from '../assets/right.png'
import lib from '../assets/csulib.png'

export default function Homepage({}){
  return(
  <div className='p-0 m-0'>
      <div className="bg-[#9ACBD0] pb-40" id='#HERO'>
        <img src={HERO} className='w-full px-30'/>
      </div>
      
    <div className="flex flex-col items-center text-center -mt-25 space-y-5 px-4">
      <h1 className="text-4xl md:text-5xl font-semibold text-white">Key Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-md px-5 py-10 hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold text-[#006A71] mb-8">Instant Notification Access</h2>
          <p className="text-gray-600 text-sm">Stay updated with real-time alerts and important messages.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-md px-5 py-10 hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold text-[#006A71] mb-8">Admin Announcement Tool</h2>
          <p className="text-gray-600 text-sm">Effortlessly create and publish announcements to your audience.</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-md px-5 py-10 hover:shadow-lg transition duration-300">
          <h2 className="text-xl font-semibold text-[#006A71] mb-8">Rapid Attendance Tracking</h2>
          <p className="text-gray-600 text-sm">Quickly record and manage attendance with just a few clicks.</p>
        </div>
      </div>
    </div>

    <div>
        <h2 className='text-center text-4xl mt-15 mb-10 font-semibold text-[#006A71]'>About Us</h2>
        <div className="card-container">
          <div className="container-1">
              <img src={left} alt="" />
            <div className="half">
              <h2>RoboCore</h2>
              <p>RoboCore is a web-based platform built to make attendance tracking and event management easier and more efficient for organizations. With features like QR code check-ins, a real-time event calendar, and announcement notifications, RoboCore helps keep members informed and connected. Admins can create and update schedules, monitor attendance, and manage member data — all from one place. Whether you're organizing events or participating in them, RoboCore is here to simplify the way your organization stays organized.</p>
              </div>
          </div>
          <div className="container-2">
            <div className="half">
              <h2>CSU - Robotics Enthusiats Club</h2>
              <p>The Robotics Enthusiasts Club of Caraga State University is a student-led organization passionate about exploring the world of robotics, artificial intelligence, and machine learning. We aim to create a space where curious minds can learn, build, and innovate through hands-on projects, workshops, and competitions. Whether you're a beginner or already deep into code and circuits, our community is all about sharing knowledge, growing skills, and pushing the boundaries of what technology can do. If you're excited about the future of intelligent machines — this is the place to be.</p>
            </div>
            <img src={right} alt="" />
          </div>
        </div>
    </div>

  <div className="contact-container">
      <div className="contact-image">
        <img src={lib} alt="Contact" />
        <div className="image-mask"></div>
      </div>
      <div className="contact-form">
        <form>
          <h2>Contact Us</h2>
          <p>Spot a bug? Let us know and we’ll kick it out!</p>
          <label>Name</label>
          <input type="text" placeholder="Your Name" required/>
          <label>Email</label>
          <input type="email" placeholder="Your Email" required/>
          <label>Message</label>
          <textarea rows="4" placeholder="Your Message" required></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>

  </div>
  );
}