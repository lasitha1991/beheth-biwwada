import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  return (
    <div style={{fontFamily: 'system-ui, sans-serif', padding: 12}}>
      <header style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <h2>Medicine Tracker</h2>
        <nav>
          <Link to="/">Home</Link> | <Link to="/calendar">Calendar</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}
