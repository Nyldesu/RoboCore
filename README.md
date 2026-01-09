
# Web-Based Attendance and Announcement System

## Project Description

The **Web-Based Attendance and Announcement System** is a full-stack web application developed to automate student attendance tracking and streamline announcement dissemination. The system records attendance through QR code scanning or student ID validation and allows administrators to send announcements to all registered students via email.

The system is built using **React.js** for the frontend, **Express.js** for the backend API, **Supabase** for database and authentication services, and **Brevo API** for automated email delivery.

The **live deployment** of the system is available at:
**[https://robocore-onrender.com](https://robocore.onrender.com)**

---

## Technology Stack

### Frontend

* **React.js** – User interface and client-side logic
* **HTML5 / CSS3 / JavaScript**

### Backend

* **Node.js**
* **Express.js** – RESTful API

### Database & Authentication

* **Supabase**

  * PostgreSQL database
  * Authentication (Admin and Student roles)
  * Secure data storage

### Email Service

* **Brevo API (Sendinblue)** – Email delivery for announcements

---

## System Features

### 1. Attendance Tracking Module

* QR code scanning or student ID input
* Validation of student data using Supabase
* Automatic recording of:

  * Student ID
  * Full Name
  * Date
  * Time
* Real-time display of present students per day
* Secure storage of attendance records in PostgreSQL (Supabase)

---

### 2. Announcement Module

* Administrator creates announcements via the dashboard
* Announcements are stored in Supabase
* Automatic email broadcasting to all registered students
* Emails are sent using the Brevo API

---

## User Roles

### Administrator

* View daily attendance reports
* Create and send announcements
* Manage student records

---

## 4. Setup Instructions (README / Installation Guide)

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* Supabase account
* Brevo account with API key

---

### Live Deployment

The live version of the system is deployed at:

**[https://robocore.onrender.com](https://robocore.onrender.com)**

You can use this URL to **access the system without local setup** for demonstration or evaluation.

---

### Backend Setup (Express.js)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following:

   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   BREVO_API_KEY=your_brevo_api_key
   ```

4. Start the backend server:

   ```bash
   node server.js
   ```

Backend will run at:

```
http://localhost:5000
```

---

### Frontend Setup (React.js)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   BREVO_API_KEY=
   JWT_SECRET=
   SUPABASE_URL=  
   SUPABASE_KEY=
   VITE_API_URL=

   ```

4. Start the React application:

   ```bash
   npm run dev
   ```

Frontend will run at:

```
http://localhost:3000
```

---

## Supabase Database Structure (Summary)

### Tables

* **students**

  * id
  * student_id
  * full_name
  * email

* **attendance**

  * id
  * student_id
  * date
  * time

* **announcements**

  * id
  * title
  * message
  * created_at

---

## 5. Sample User Account (For Testing / Evaluation)

### Administrator Account

* **Email:** marcjohncastillon18@gmail.com
* **Password:** @Admin1
* **Role:** Administrator
---

## Email Delivery Workflow (Brevo API)

1. Admin submits an announcement
2. Backend retrieves all student email addresses from Supabase
3. Express.js sends the announcement using Brevo API
4. Students receive the email instantly

---

## Security and Data Privacy

* Supabase Authentication for secure login
* Role-based access control
* Environment variables protect sensitive keys
* Attendance records are immutable without admin privileges

---

## Client Approval

This system has been reviewed and approved by the client. All core functionalities comply with the client’s operational requirements.

---

## Future Enhancements
* Attendance analytics dashboard
* SMS notifications
* Export attendance reports (PDF/Excel)
* Mobile application integration
* Borrowing System

