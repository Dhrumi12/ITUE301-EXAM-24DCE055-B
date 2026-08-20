import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || 'pending').toLowerCase();
  
  return (
    <span className={`status-badge ${normalizedStatus}`}>
      <span className="dot">●</span> {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
