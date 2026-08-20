import React from 'react';
import StatusBadge from './StatusBadge';

// Task 1: AppointmentCard Component accepting patientName, doctorName, date, timeSlot, status
const AppointmentCard = ({ patientName, doctorName, date, timeSlot, status, reason }) => {
  return (
    <div className="appointment-card">
      <div className="card-top">
        <div className="patient-info">
          <h3>{patientName || 'Unnamed Patient'}</h3>
          <div className="doctor-label">👨‍⚕️ {doctorName || 'Unassigned Doctor'}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Date</span>
          <span className="detail-value">📅 {date || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time Slot</span>
          <span className="detail-value">⏰ {timeSlot || 'N/A'}</span>
        </div>
      </div>

      {reason && (
        <div className="reason-text">
          "{reason}"
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
