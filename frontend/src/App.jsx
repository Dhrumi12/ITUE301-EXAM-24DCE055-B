import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          {/* Task 2 React Router Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY — CSPIT-IT</p>
        <p>ITUE301 Advanced Web Development Frameworks | Roll No: 24DCE055 | Batch C</p>
      </footer>
    </Router>
  );
}

export default App;
