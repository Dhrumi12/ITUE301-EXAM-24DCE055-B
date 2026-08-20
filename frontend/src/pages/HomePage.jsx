import React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const HomePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/appointments')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAppointments(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch appointments:", err);
        // Fallback default appointments to demonstrate Task 1 props
        setAppointments([
          { _id: '1', patientName: 'John Doe', doctorName: 'Dr. Sarah Jenkins', date: '2026-08-22', timeSlot: '10:00 AM', status: 'confirmed', reason: 'Routine Heart Checkup' },
          { _id: '2', patientName: 'Jane Smith', doctorName: 'Dr. Robert Chen', date: '2026-08-23', timeSlot: '02:30 PM', status: 'pending', reason: 'Migraine Consultation' },
          { _id: '3', patientName: 'Alex Johnson', doctorName: 'Dr. Emily Taylor', date: '2026-08-21', timeSlot: '11:15 AM', status: 'cancelled', reason: 'Reschedule requested by patient' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hospital Appointment Dashboard</h1>
        <p className="page-subtitle">Welcome to MedCare Plus — View and manage recent patient appointments.</p>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
        Current Appointments ({appointments.length})
      </h2>

      {loading ? (
        <div className="state-container">
          <div className="spinner"></div>
          <p>Loading patient appointments...</p>
        </div>
      ) : (
        <div className="appointment-grid">
          {appointments.map((item) => (
            /* Task 1: Props passed from parent component to AppointmentCard */
            <AppointmentCard
              key={item._id}
              patientName={item.patientName}
              doctorName={item.doctorName}
              date={item.date}
              timeSlot={item.timeSlot}
              status={item.status}
              reason={item.reason}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
