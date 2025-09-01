import React, { useState } from "react";
import "../styles/Navbar.css";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import Sidebar from "./Sidebar";
import VendorList from "./VendorList"

// Import your pages
import Dashboard from "./Dashboard";
import VendorPage from "./VendorPage";
import UserRegister from "./UserRegister"
import UserList from "./UserList";
// import AddUserPage from "../pages/AddUserPage";

const Navbar = ({ setPage, setAdmin }) => {
  const [sidebar, setSidebar] = useState(true);
  const [activePage, setActivePage] = useState("dashboard"); // 👈 default page

  const handleLogout = () => {
    setPage("login");
    setAdmin(false);
  };

  // Render page based on sidebar navigation
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard isSidebarOpen={sidebar} />;
      case "add-vendor":
        return <VendorPage isSidebarOpen={sidebar} />;
      case "vendor-list":
        return <VendorList isSidebarOpen={sidebar} />;
      case "add-user":
        return <UserRegister isSidebarOpen={sidebar} />;
      case "user-list":
        return <UserList isSidebarOpen={sidebar} />;
      default:
        // return <Dashboard />;
        return <></>;
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        {/* Left: Logo & Sidebar Toggle */}
        <div className={`nav-left ${sidebar ? "shifted" : ""}`}
          onClick={() => setSidebar(!sidebar)}
        >
          <IoReorderThreeSharp className="menu-icon" />
          <h1 className="logo">
            Store<span>Rating</span>
          </h1>
        </div>
        {/* Right: Logout */}
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>
            Log Out <IoMdExit className="logout-icon" />
          </button>
        </div>
      </nav>

      {/* Layout with Sidebar + Content */}
      <div className="main">
        {sidebar && <Sidebar onNavigate={setActivePage} />} {/* Sidebar */}
        <div className="content">{renderPage()}</div> {/* Page content */}
      </div>
    </div>
  );
};

export default Navbar;
