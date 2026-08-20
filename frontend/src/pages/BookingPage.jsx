import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();

  // Task 2 Meaningful State 1: Managed Form Data object using useState
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    reason: '',
    bloodGroup: 'O+'
  });

  // Task 2 Meaningful State 2: Selected Doctor details state
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);

  // Additional UI states
  const [doctorsList, setDoctorsList] = useState([]);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch doctors for doctor dropdown selection
  useEffect(() => {
    fetch('/api/v1/doctors')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setDoctorsList(json.data);
          // Set default doctor selection
          setFormData(prev => ({ ...prev, doctorName: json.data[0].name }));
          setSelectedDoctorDetails(json.data[0]);
        }
      })
      .catch(err => console.error("Could not fetch doctor list for dropdown:", err));
  }, []);

  // Handle Input Changes & Update State meaningfully
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'doctorName') {
      const doc = doctorsList.find(d => d.name === value);
      setSelectedDoctorDetails(doc || { name: value, specialisation: 'General Medicine' });
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    setFormError(null);

    if (!formData.patientName.trim()) {
      setFormError("Patient name is required!");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.details?.reason || "Failed to create appointment");
      }

      setSubmitMessage("🎉 Appointment successfully booked!");
      setFormData({
        patientName: '',
        doctorName: doctorsList[0]?.name || 'Dr. Sarah Jenkins',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '09:00 AM',
        reason: '',
        bloodGroup: 'O+'
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Book an Appointment</h1>
        <p className="page-subtitle">Fill in the patient and schedule details below to reserve your slot.</p>
      </div>

      {submitMessage && (
        <div className="success-alert">
          <strong>{submitMessage}</strong> Redirecting to homepage...
        </div>
      )}

      {formError && (
        <div className="error-alert">
          <strong>Error: </strong> {formError}
        </div>
      )}

      <div className="booking-container">
        {/* Task 2 Appointment Form */}
        <div className="form-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
            Appointment Details
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Field 1: Patient Name */}
            <div className="form-group">
              <label htmlFor="patientName">Patient Full Name *</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Field 2: Doctor Name */}
            <div className="form-group">
              <label htmlFor="doctorName">Select Doctor *</label>
              <select
                id="doctorName"
                name="doctorName"
                className="form-control"
                value={formData.doctorName}
                onChange={handleChange}
                required
              >
                {doctorsList.length > 0 ? (
                  doctorsList.map(doc => (
                    <option key={doc._id} value={doc.name}>
                      {doc.name} ({doc.specialisation})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                    <option value="Dr. Robert Chen">Dr. Robert Chen (Neurology)</option>
                    <option value="Dr. Emily Taylor">Dr. Emily Taylor (Pediatrics)</option>
                    <option value="Dr. Michael Adams">Dr. Michael Adams (Orthopedics)</option>
                  </>
                )}
              </select>
            </div>

            {/* Field 3 & 4: Date & Time Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="date">Appointment Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot *</label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  className="form-control"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:15 PM">04:15 PM</option>
                </select>
              </div>
            </div>

            {/* Additional Fields: Reason & Blood Group */}
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                className="form-control"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason / Symptoms (Max 300 chars)</label>
              <textarea
                id="reason"
                name="reason"
                className="form-control"
                rows="3"
                placeholder="Describe reason for visit..."
                maxLength="300"
                value={formData.reason}
                onChange={handleChange}
              ></textarea>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {formData.reason.length}/300 characters
              </span>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Confirm Appointment Booking'}
            </button>
          </form>
        </div>

        {/* Task 2 Requirement: Display entered patient name or selected value as state changes */}
        <div className="live-preview-card">
          <div className="live-preview-title">⚡ Live Form State Preview</div>

          <div className="preview-field">
            <label>Patient Name (Live State)</label>
            <val>{formData.patientName || 'Waiting for input...'}</val>
          </div>

          <div className="preview-field">
            <label>Selected Doctor</label>
            <val>{formData.doctorName || 'None'}</val>
            {selectedDoctorDetails && (
              <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
                Specialisation: {selectedDoctorDetails.specialisation}
              </span>
            )}
          </div>

          <div className="preview-field">
            <label>Date & Time Slot</label>
            <val>{formData.date} at {formData.timeSlot}</val>
          </div>

          <div className="preview-field">
            <label>Blood Group</label>
            <val>{formData.bloodGroup}</val>
          </div>

          <div className="preview-field" style={{ borderBottom: 'none' }}>
            <label>Reason Summary</label>
            <val style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 400 }}>
              {formData.reason || 'No specific reason entered.'}
            </val>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
