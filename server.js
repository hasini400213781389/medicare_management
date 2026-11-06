require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "MediCare Desk API" }));

// Dashboard summary
app.get("/api/dashboard", asyncRoute(async (req, res) => {
  const [[patients]] = await pool.query("SELECT COUNT(*) AS total FROM patients");
  const [[doctors]] = await pool.query("SELECT COUNT(*) AS total FROM doctors");
  const [[appointments]] = await pool.query("SELECT COUNT(*) AS total FROM appointments");
  const [[today]] = await pool.query("SELECT COUNT(*) AS total FROM appointments WHERE appointment_date = CURDATE()");
  const [recent] = await pool.query(`
    SELECT a.appointment_id, p.name AS patient_name, d.name AS doctor_name,
           d.specialization, a.appointment_date, a.appointment_time, a.status
    FROM appointments a
    JOIN patients p ON p.patient_id=a.patient_id
    JOIN doctors d ON d.doctor_id=a.doctor_id
    ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 6
  `);
  res.json({ patients: patients.total, doctors: doctors.total, appointments: appointments.total, today: today.total, recent });
}));

// Patients
app.get("/api/patients", asyncRoute(async (req, res) => {
  const q = `%${req.query.search || ""}%`;
  const [rows] = await pool.query(
    "SELECT * FROM patients WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY patient_id DESC",
    [q, q, q]
  );
  res.json(rows);
}));
app.post("/api/patients", asyncRoute(async (req, res) => {
  const { name, email, phone, gender, age } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Patient name and email are required." });
  const [result] = await pool.query(
    "INSERT INTO patients (name,email,phone,gender,age) VALUES (?,?,?,?,?)",
    [name, email, phone || null, gender || null, age || null]
  );
  res.status(201).json({ message: "Patient created successfully.", patient_id: result.insertId });
}));
app.put("/api/patients/:id", asyncRoute(async (req, res) => {
  const { name, email, phone, gender, age } = req.body;
  const [result] = await pool.query(
    "UPDATE patients SET name=?,email=?,phone=?,gender=?,age=? WHERE patient_id=?",
    [name, email, phone || null, gender || null, age || null, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Patient not found." });
  res.json({ message: "Patient updated successfully." });
}));
app.delete("/api/patients/:id", asyncRoute(async (req, res) => {
  const [result] = await pool.query("DELETE FROM patients WHERE patient_id=?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Patient not found." });
  res.json({ message: "Patient deleted successfully." });
}));

// Doctors
app.get("/api/doctors", asyncRoute(async (req, res) => {
  const q = `%${req.query.search || ""}%`;
  const [rows] = await pool.query(
    "SELECT * FROM doctors WHERE name LIKE ? OR specialization LIKE ? OR email LIKE ? ORDER BY doctor_id DESC",
    [q, q, q]
  );
  res.json(rows);
}));
app.post("/api/doctors", asyncRoute(async (req, res) => {
  const { name, specialization, phone, email } = req.body;
  if (!name || !specialization || !email) return res.status(400).json({ message: "Name, specialization and email are required." });
  const [result] = await pool.query(
    "INSERT INTO doctors (name,specialization,phone,email) VALUES (?,?,?,?)",
    [name, specialization, phone || null, email]
  );
  res.status(201).json({ message: "Doctor created successfully.", doctor_id: result.insertId });
}));
app.put("/api/doctors/:id", asyncRoute(async (req, res) => {
  const { name, specialization, phone, email } = req.body;
  const [result] = await pool.query(
    "UPDATE doctors SET name=?,specialization=?,phone=?,email=? WHERE doctor_id=?",
    [name, specialization, phone || null, email, req.params.id]
  );
  if (!result.affectedRows) return res.status(404).json({ message: "Doctor not found." });
  res.json({ message: "Doctor updated successfully." });
}));
app.delete("/api/doctors/:id", asyncRoute(async (req, res) => {
  const [result] = await pool.query("DELETE FROM doctors WHERE doctor_id=?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Doctor not found." });
  res.json({ message: "Doctor deleted successfully." });
}));

// Appointments
app.get("/api/appointments", asyncRoute(async (req, res) => {
  const q = `%${req.query.search || ""}%`;
  const [rows] = await pool.query(`
    SELECT a.*, p.name AS patient_name, d.name AS doctor_name, d.specialization
    FROM appointments a
    JOIN patients p ON p.patient_id=a.patient_id
    JOIN doctors d ON d.doctor_id=a.doctor_id
    WHERE p.name LIKE ? OR d.name LIKE ? OR d.specialization LIKE ? OR a.status LIKE ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `, [q, q, q, q]);
  res.json(rows);
}));
app.post("/api/appointments", asyncRoute(async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !appointment_time)
    return res.status(400).json({ message: "Patient, doctor, date and time are required." });
  const [result] = await pool.query(
    "INSERT INTO appointments (patient_id,doctor_id,appointment_date,appointment_time,status) VALUES (?,?,?,?,?)",
    [patient_id, doctor_id, appointment_date, appointment_time, status || "Scheduled"]
  );
  res.status(201).json({ message: "Appointment booked successfully.", appointment_id: result.insertId });
}));
app.patch("/api/appointments/:id/status", asyncRoute(async (req, res) => {
  const allowed = ["Scheduled", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid appointment status." });
  const [result] = await pool.query("UPDATE appointments SET status=? WHERE appointment_id=?", [req.body.status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Appointment not found." });
  res.json({ message: "Appointment status updated." });
}));
app.delete("/api/appointments/:id", asyncRoute(async (req, res) => {
  const [result] = await pool.query("DELETE FROM appointments WHERE appointment_id=?", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: "Appointment not found." });
  res.json({ message: "Appointment deleted successfully." });
}));

app.use("/api", (req, res) => res.status(404).json({ message: "API endpoint not found." }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "That email address is already registered." });
  if (err.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ message: "Please select a valid patient and doctor." });
  res.status(500).json({ message: "Server error. Check your database connection and try again." });
});

app.listen(PORT, () => console.log(`Hospital system running at http://localhost:${PORT}`));
