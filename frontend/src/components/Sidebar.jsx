import { useState } from "react";
import "../styles/Sidebar.css";
import { FaHome, FaRegUser, FaStore } from "react-icons/fa";

const Sidebar = ({ onNavigate }) => {
  const [vendorOpen, setVendorOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <div className="sidebar">
      {/* Dashboard */}
      <button className="menu-item" onClick={() => onNavigate("dashboard")}>
        <FaHome className="icon home" />
        <span>Dashboard</span>
      </button>

      {/* Vendors */}
      <div className="menu-section">
        <button
          className="menu-item"
          onClick={() => setVendorOpen(!vendorOpen)}
        >
          <FaStore className="icon vendor" />
          <span>Vendors</span>
        </button>
        <div className={`submenu ${vendorOpen ? "open" : ""}`}>
          <p onClick={() => onNavigate("add-vendor")}>➕ Add Vendor</p>
          <p onClick={() => onNavigate("vendor-list")}>📋 Vendor List</p>
        </div>
      </div>

      {/* Users */}
      <div className="menu-section">
        <button
          className="menu-item"
          onClick={() => setUserOpen(!userOpen)}
        >
          <FaRegUser className="icon user" />
          <span>Users</span>
        </button>
        <div className={`submenu ${userOpen ? "open" : ""}`}>
          <p onClick={() => onNavigate("add-user")}>➕ Add User</p>
          <p onClick={() => onNavigate("user-list")}>📋 User List</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
