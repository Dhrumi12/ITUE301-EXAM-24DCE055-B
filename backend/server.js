const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Mongoose Models
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Track MongoDB connection state
let isDbConnected = false;

// Middleware
app.use(cors());
app.use(express.json());

// Task 3: Custom requestLogger applied globally
app.use(requestLogger);

// In-Memory Fallback Data
let inMemoryDoctors = [
  { _id: "doc1", name: "Dr. Sarah Jenkins", email: "sarah.j@medcare.com", specialisation: "Cardiology", available: true },
  { _id: "doc2", name: "Dr. Robert Chen", email: "robert.c@medcare.com", specialisation: "Neurology", available: true },
  { _id: "doc3", name: "Dr. Emily Taylor", email: "emily.t@medcare.com", specialisation: "Pediatrics", available: false },
  { _id: "doc4", name: "Dr. Michael Adams", email: "michael.a@medcare.com", specialisation: "Orthopedics", available: true }
];

let inMemoryAppointments = [
  {
    _id: "app1",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Jenkins",
    date: "2026-08-22",
    timeSlot: "10:00 AM",
    status: "confirmed",
    reason: "Routine Heart Checkup"
  },
  {
    _id: "app2",
    patientName: "Jane Smith",
    doctorName: "Dr. Robert Chen",
    date: "2026-08-23",
    timeSlot: "02:30 PM",
    status: "pending",
    reason: "Migraine Consultation"
  },
  {
    _id: "app3",
    patientName: "Alex Johnson",
    doctorName: "Dr. Emily Taylor",
    date: "2026-08-21",
    timeSlot: "11:15 AM",
    status: "cancelled",
    reason: "Reschedule requested by patient"
  }
];

// Seed MongoDB if empty
const seedDatabaseIfConnected = async () => {
  if (!isDbConnected) return;
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.insertMany([
        { name: "Dr. Sarah Jenkins", email: "sarah.j@medcare.com", specialisation: "Cardiology", available: true },
        { name: "Dr. Robert Chen", email: "robert.c@medcare.com", specialisation: "Neurology", available: true },
        { name: "Dr. Emily Taylor", email: "emily.t@medcare.com", specialisation: "Pediatrics", available: false },
        { name: "Dr. Michael Adams", email: "michael.a@medcare.com", specialisation: "Orthopedics", available: true }
      ]);
      console.log("🌱 Initial doctors seeded into MongoDB.");
    }
  } catch (err) {
    console.error("Seeding error:", err.message);
  }
};

// ---------------- REST API ENDPOINTS ---------------- //

// GET /api/v1/doctors - Task 3 & Task 4
app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    if (isDbConnected) {
      const doctors = await Doctor.find();
      return res.status(200).json({ success: true, data: doctors });
    }
    return res.status(200).json({ success: true, data: inMemoryDoctors });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/appointments - Task 3
app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    if (isDbConnected) {
      const appointments = await Appointment.find()
        .populate('patientId', 'name email phone bloodGroup age')
        .populate('doctorId', 'name specialisation email available');
      
      const formatted = appointments.map(app => ({
        _id: app._id,
        patientName: app.patientId ? app.patientId.name : 'Unknown Patient',
        doctorName: app.doctorId ? app.doctorId.name : 'Unknown Doctor',
        patientId: app.patientId,
        doctorId: app.doctorId,
        date: app.date,
        timeSlot: app.timeSlot,
        status: app.status,
        reason: app.reason
      }));

      return res.status(200).json({ success: true, data: formatted });
    }
    return res.status(200).json({ success: true, data: inMemoryAppointments });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/appointments - Task 3 & Task 5
app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const { patientName, doctorName, date, timeSlot, status, reason, patientEmail, bloodGroup, age, phone } = req.body;

    if (!patientName || !doctorName || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        details: {
          patientName: !patientName ? "Patient name is required" : undefined,
          doctorName: !doctorName ? "Doctor name is required" : undefined,
          date: !date ? "Date is required" : undefined,
          timeSlot: !timeSlot ? "Time slot is required" : undefined
        }
      });
    }

    if (reason && reason.length > 300) {
      return res.status(400).json({
        success: false,
        error: "Validation Failed",
        details: { reason: "Reason cannot exceed 300 characters" }
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Validation Failed",
        details: { status: `${status} is not a valid status. Allowed: pending, confirmed, cancelled` }
      });
    }

    if (isDbConnected) {
      // Find or create Patient
      const email = patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      let patient = await Patient.findOne({ email });
      if (!patient) {
        patient = new Patient({
          name: patientName,
          email: email,
          phone: phone || "1234567890",
          bloodGroup: bloodGroup || "O+",
          age: age || 30
        });
        await patient.save();
      }

      // Find or create Doctor
      let doctor = await Doctor.findOne({ name: doctorName });
      if (!doctor) {
        doctor = new Doctor({
          name: doctorName,
          specialisation: "General Medicine",
          email: `${doctorName.toLowerCase().replace(/\s+/g, '.')}@medcare.com`
        });
        await doctor.save();
      }

      // Create Mongoose Appointment
      const newApp = new Appointment({
        patientId: patient._id,
        doctorId: doctor._id,
        date: date,
        timeSlot: timeSlot,
        status: status || 'pending',
        reason: reason || ''
      });

      await newApp.save();

      return res.status(201).json({
        success: true,
        message: "Appointment created successfully in MongoDB",
        data: {
          _id: newApp._id,
          patientName: patient.name,
          doctorName: doctor.name,
          date: newApp.date,
          timeSlot: newApp.timeSlot,
          status: newApp.status,
          reason: newApp.reason
        }
      });
    }

    // In-Memory Fallback
    const newInMem = {
      _id: `app_${Date.now()}`,
      patientName,
      doctorName,
      date,
      timeSlot,
      status: status || 'pending',
      reason: reason || ''
    };
    inMemoryAppointments.push(newInMem);

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newInMem
    });

  } catch (err) {
    next(err);
  }
});

// Task 5 Demonstration Route: Mongoose Validation Tester
app.post('/api/v1/test-validation', async (req, res, next) => {
  try {
    const { type, data } = req.body;

    if (type === 'patient') {
      const patient = new Patient(data);
      await patient.validate(); // Triggers Mongoose schema validation
      return res.status(200).json({ success: true, message: "Patient schema valid!", data: patient });
    }

    if (type === 'appointment') {
      const appDoc = new Appointment(data);
      await appDoc.validate();
      return res.status(200).json({ success: true, message: "Appointment schema valid!", data: appDoc });
    }

    return res.status(400).json({ success: false, error: "Invalid test type. Use 'patient' or 'appointment'." });
  } catch (err) {
    next(err); // Passed to global errorHandler middleware
  }
});

// Endpoint to force 500 error for testing error handling
app.get('/api/v1/test-error', (req, res, next) => {
  const error = new Error("Simulated Unhandled Server Error");
  res.status(500);
  next(error);
});

// Task 3: Global Error Handling Middleware (MUST BE LAST)
app.use(errorHandler);

// Start Server
const startServer = async () => {
  isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabaseIfConnected();
  }
  app.listen(PORT, () => {
    console.log(`🚀 Hospital Appointment Backend Server running on http://localhost:${PORT}`);
  });
};

startServer();
