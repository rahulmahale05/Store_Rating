import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

const AdminDashboard = ({ isSidebarOpen }) => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalUsers: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={`dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <h2>📊 Admin Dashboard</h2>
      <div className="cards">
        <div className="card green">
          <h3>{stats.totalVendors}</h3>
          <p>Total Vendors</p>
        </div>
        <div className="card red">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="card blue">
          <h3>{stats.totalRatings}</h3>
          <p>Total Ratings Submitted</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
