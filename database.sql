CREATE DATABASE IF NOT EXISTS medicare_appointment_db;
USE medicare_appointment_db;

CREATE TABLE IF NOT EXISTS patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  gender VARCHAR(10),
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  phone VARCHAR(15),
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id)
    REFERENCES patients(patient_id) ON DELETE CASCADE,
  CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- Optional sample data (safe to run once on an empty database)
INSERT IGNORE INTO patients (name,email,phone,gender,age) VALUES
('Aarav Sharma','aarav@example.com','9876501234','Male',28),
('Ananya Rao','ananya@example.com','9876505678','Female',34),
('Rohan Kumar','rohan@example.com','9876509876','Male',42);

INSERT IGNORE INTO doctors (name,specialization,phone,email) VALUES
('Dr. Meera Reddy','Cardiology','9123400001','meera@hospital.com'),
('Dr. Arjun Patel','Dermatology','9123400002','arjun@hospital.com'),
('Dr. Kavya Nair','Neurology','9123400003','kavya@hospital.com');
