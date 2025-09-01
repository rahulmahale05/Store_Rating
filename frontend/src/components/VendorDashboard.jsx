import React, { useEffect, useState } from "react";
import "../styles/VendorDashboard.css";

const VendorDashboard = ({ storeId }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/vendors/${storeId}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [storeId]);

  const filteredUsers = users.filter(
    (u) =>
      u.id.toString().includes(search) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vendor-dashboard">
      <h1 className="dashboard-title">📊 Store Users & Ratings</h1>

      {/* 🔍 Interactive Search Box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by ID, Name, or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="no-users">😕 No users found.</p>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>⭐ Rating</th>
                <th>📅 Rated On</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td className="rating-cell">⭐ {u.rating}</td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
