import React from 'react';
import '../CSS/Contactus.css';

const submitMessage = (e) => {
  e.preventDefault();
  alert("Thank you for reaching out! We will get back to you soon.");
}

function ContactUs() {
  return (
    <div className="contact-container">
      <div className="contact-image">
        <img src="csulib.png" alt="Contact" />
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
          <button type="submit" onClick={submitMessage}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs