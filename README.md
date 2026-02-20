📌 Sydney Events Aggregation Platform (MERN Stack)
🌏 Overview

The Sydney Events Aggregation Platform is a full-stack MERN application that automatically scrapes public event websites for events in Sydney, Australia, stores them in a database, and presents them through a clean, user-friendly web interface.

The system includes:

Automated event scraping

Lifecycle management (new, updated, inactive detection)

Public event listing interface

Email capture with consent before ticket redirection

Google OAuth authentication

Admin dashboard with filtering and import workflow

Event status tagging and metadata tracking

This project demonstrates end-to-end full-stack engineering, combining data extraction, backend processing, authentication, state management, and UI rendering.
youtube link :https://youtu.be/yw1Ti2eMvoo
🏗 Architecture Overview

The application follows a standard MERN architecture:

🔹 Frontend

React (Vite)

Axios for API communication

React Router for navigation

Local state management using React hooks

🔹 Backend

Node.js

Express.js

Mongoose (MongoDB ODM)

Passport.js (Google OAuth)

JWT Authentication

Axios + Cheerio for scraping

🔹 Database

MongoDB Atlas (Cloud-hosted)

🔹 Flow Pipeline

Scrape → Store → Detect Changes → Serve API → Display → Review → Import → Update Status

⚙️ Features
A) Event Scraping & Auto Updates

The scraper collects event data from public event platforms (e.g., Eventbrite Sydney listings).

Each event stored includes:

Title

Date & Time

Venue Name

City

Description

Category / Tags

Image URL

Source Website

Original Event URL

Last Scraped Timestamp

Status Tag

🔄 Lifecycle Detection

The system automatically:

Detects new events

Detects updated events

Detects inactive/removed events

Inactive events are marked when:

They no longer appear in the source website

They are expired

They are removed from the listing

Status tags used:

new

updated

inactive

imported

B) Public Event Listing Website

The public UI displays all active events in a clean, minimal grid layout.

Each event card includes:

Event title

City

Source website

“GET TICKETS” button

🎟 Ticket Flow

When users click GET TICKETS:

A modal asks for:

Email address

Consent checkbox

Email + consent + event reference are saved to database

User is redirected to original event URL

This ensures lead capture before traffic redirection.

C) Google OAuth + Admin Dashboard

The system includes a protected admin dashboard with Google OAuth authentication.

🔐 Authentication

Google OAuth 2.0 via Passport.js

JWT-based session management

Token stored securely in localStorage

Protected backend routes via middleware

Only authenticated users can access:

/dashboard
📊 Admin Dashboard Features

The dashboard is designed as a review and import management panel.

1️⃣ Filters

🔍 Search filter (by event title)

🌍 City filter (default: Sydney; scalable)

Real-time filtering

2️⃣ Table View

Each event row displays:

Title

Status (color-coded badge)

Source

Imported By

Imported At

Import Action

3️⃣ Status Badges

Color-coded visual indicators:

🟢 New

🟠 Updated

🔴 Inactive

🔵 Imported

4️⃣ Import Workflow

Admin can click Import:

Event status changes to imported

importedAt timestamp stored

importedBy (admin email) stored

Import button disables after import.

5️⃣ Preview Panel

Clicking an event row opens a detailed preview panel:

Full description

Venue

City

Source

Direct link to original event

6️⃣ Analytics Summary

Dashboard header displays:

Total events

New count

Updated count

Imported count

Inactive count

This provides high-level operational insight.

🗄 Database Schema (Event Model)
{
  title: String,
  dateTime: String,
  venueName: String,
  city: String,
  description: String,
  category: String,
  imageUrl: String,
  sourceWebsite: String,
  originalUrl: String,
  status: String,
  lastScrapedAt: Date,
  importedAt: Date,
  importedBy: String
}
🔐 Security Measures

Environment variables stored in .env

.gitignore prevents secrets from being pushed

JWT authentication for protected routes

CORS properly configured

MongoDB Atlas with IP restrictions

🚀 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/Khwa678/mernsydney.git
cd mernsydney
2️⃣ Backend Setup
cd backend
npm install

Create .env:

MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
JWT_SECRET=your_secret_key

Start backend:

node server.js
3️⃣ Frontend Setup
cd sydney-events-frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173

Backend runs on:

http://localhost:5000
🧠 Design Decisions
Why MERN?

Unified JavaScript stack

Scalable architecture

Rapid development

Easy API integration

Why JWT Instead of Sessions?

Stateless authentication

Easier frontend integration

Cleaner API protection

Why Status Tagging?

Enables:

Lifecycle tracking

Import workflow management

Business logic visibility

📈 Future Improvements

Pagination for large datasets

Multiple city support

Scheduler-based scraping (node-cron)

Admin roles & permissions

Dark mode UI

Production deployment (Render + Vercel)

🎥 Demo Workflow

Public site loads events

GET TICKETS triggers email capture

Email saved in DB

Redirect to source

Admin logs in via Google

Dashboard displays lifecycle states

Admin imports event

Metadata updates in real time

🏁 Conclusion

This project demonstrates:

Full-stack engineering capability

Web scraping and automation

Authentication and authorization

REST API design

Database modeling

Lifecycle state management

Admin workflow systems

The Sydney Events Platform is designed as a scalable, modular, and production-ready MERN system capable of handling real-world event aggregation workflows.

👩‍💻 Author

Khwahish
Full-Stack Developer | MERN Stack | Backend Systems | Authentication & Data Pipelines

