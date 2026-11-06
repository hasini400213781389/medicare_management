# MediCare Desk — Hospital Appointment Management System

A full-stack hospital appointment management project built with HTML, CSS, vanilla JavaScript, Node.js, Express and MySQL.

## Features
- Dashboard with patient, doctor, appointment and today's visit counts
- Patient CRUD: create, list, search, edit and delete
- Doctor CRUD: create, list, search by name/specialization, edit and delete
- Appointment booking with patient/doctor selection
- Appointment status updates: Scheduled, Confirmed, Completed, Cancelled
- Relational MySQL schema with foreign keys
- Responsive layout for desktop, tablet and mobile
- Form validation, duplicate-email handling and API error messages

## Requirements
- Node.js 18 or newer
- MySQL Server 8.x (or compatible MySQL version)
- A browser such as Chrome, Edge or Firefox

## Setup (Windows / macOS / Linux)

### 1. Extract the ZIP
Extract the project folder to a convenient location and open it in VS Code or a terminal.

### 2. Create the database
Start MySQL. Open MySQL Workbench (or the MySQL command line), then run the complete contents of `database.sql`.

Command-line example:
```bash
mysql -u root -p < database.sql
```
This creates `medicare_appointment_db`, the three tables, and a few optional sample records.

### 3. Configure database credentials
Copy `.env.example` and rename the copy to `.env`.
Update the values to match your local MySQL setup:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medicare_appointment_db
```
If your MySQL root account has no password, leave `DB_PASSWORD=` blank.

### 4. Install Node dependencies
From the project root run:
```bash
npm install
```

### 5. Start the application
For normal use:
```bash
npm start
```
For development auto-restart (optional):
```bash
npm run dev
```

### 6. Open the website
Visit:
`http://localhost:3000`

The Express server serves the frontend and API from the same port. Do not open the HTML files directly using `file://`.

## Project structure
```text
hospital-appointment-management/
├── database.sql
├── server.js
├── package.json
├── .env.example
├── src/config/db.js
└── public/
    ├── index.html
    ├── patients.html
    ├── doctors.html
    ├── appointments.html
    ├── css/style.css
    ├── js/app.js
    ├── js/records.js
    ├── js/patients.js
    ├── js/doctors.js
    ├── js/appointments.js
    └── assets/ (four original SVG illustrations)
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/dashboard` | Dashboard totals and recent appointments |
| GET/POST | `/api/patients` | List/search or create patients |
| PUT/DELETE | `/api/patients/:id` | Update or delete a patient |
| GET/POST | `/api/doctors` | List/search or create doctors |
| PUT/DELETE | `/api/doctors/:id` | Update or delete a doctor |
| GET/POST | `/api/appointments` | List/search or book appointments |
| PATCH | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Delete an appointment |

Search is supported using `?search=keyword` on the list endpoints.

## Database design
- `patients`: patient identity and contact information
- `doctors`: doctor identity, contact information and specialization
- `appointments`: links one patient to one doctor at a date and time

The appointment table uses foreign keys. Deleting a patient or doctor cascades to their appointments. Use deletion carefully in a real deployment.

## Troubleshooting
- **Access denied:** check `DB_USER` and `DB_PASSWORD` in `.env`.
- **Unknown database:** run `database.sql` before starting the server.
- **ECONNREFUSED:** make sure MySQL Server is running and `DB_HOST` / port are correct.
- **Port already in use:** change `PORT` in `.env`, then restart.
- **Duplicate email:** patient and doctor email addresses must be unique.

## Production note
This is an academic/demo starter, not a production-ready medical records platform. Before real-world deployment, add authentication and role-based access, HTTPS, audit logs, backups, stricter validation, privacy controls, and applicable healthcare data-protection compliance. Never place real patient data in a demo environment.


## Personal project note
This is an independently rebranded academic implementation. Configure your own local MySQL credentials in `.env`; never commit `.env` or real patient information.
