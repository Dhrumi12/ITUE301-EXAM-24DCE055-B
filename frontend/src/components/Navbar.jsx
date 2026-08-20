import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">M+</div>
          <span>MedCare <span style={{ color: '#2563eb' }}>Plus</span></span>
        </Link>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/doctors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Doctors
            </NavLink>
          </li>
          <li>
            <NavLink to="/booking" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Book Appointment
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
