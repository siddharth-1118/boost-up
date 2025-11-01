import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ setAuth }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Boost Up LMS</h1>
        <div className="nav-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <div className="user-info">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        <div className="dashboard-sections">
          <div className="section-card">
            <h3>Materials</h3>
            <p>Access and manage course materials</p>
          </div>
          <div className="section-card">
            <h3>Attendance</h3>
            <p>View and manage attendance records</p>
          </div>
          <div className="section-card">
            <h3>Marks</h3>
            <p>View grades and exam results</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
