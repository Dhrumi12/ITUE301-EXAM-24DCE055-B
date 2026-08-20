import React, { useState, useEffect } from 'react';

// Task 4: REST API Consumption in React with three states (data, loading, error)
const DoctorsPage = () => {
  // Task 4 Requirement: Maintain three states: data, loading, error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Task 4 Requirement: Use useEffect() to make API call when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/doctors');
        if (!response.ok) {
          throw new Error(`Server returned error HTTP status ${response.status}`);
        }

        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err.message || "Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Medical Specialists & Doctors</h1>
        <p className="page-subtitle">Browse our team of available medical practitioners and specialists.</p>
      </div>

      {/* State 1: Loading Indicator */}
      {loading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p style={{ fontWeight: 600, color: '#2563eb' }}>Retrieving doctor directory from Express REST API...</p>
        </div>
      )}

      {/* State 2: Error Message */}
      {error && !loading && (
        <div className="error-alert">
          <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>⚠️ API Request Failure</h4>
          <p>{error}</p>
        </div>
      )}

      {/* State 3: Successful Doctor Data Rendering */}
      {!loading && !error && (
        <div>
          <p style={{ marginBottom: '1.5rem', color: '#64748b', fontSize: '0.95rem' }}>
            Showing <strong>{data.length}</strong> active specialists.
          </p>
          
          <div className="doctors-grid">
            {data.map((doctor, idx) => (
              <div key={doctor._id || idx} className="doctor-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="doctor-avatar">
                    {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DR'}
                  </div>
                  {/* Doctor Availability */}
                  <span className={`availability-badge ${doctor.available ? 'available' : 'unavailable'}`}>
                    {doctor.available ? '● Available' : '○ Unavailable'}
                  </span>
                </div>

                <div>
                  {/* Doctor Name */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{doctor.name}</h3>
                  {/* Doctor Specialisation */}
                  <p style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {doctor.specialisation}
                  </p>
                  {doctor.email && (
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      ✉️ {doctor.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
