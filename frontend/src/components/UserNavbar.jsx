import "../styles/Navbar.css";
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";

const UserNavbar = ({ setPage, setUser }) => {
    const handleLogout = () => {
    setPage("login");
    setUser(null);
  };
  return (
    <div>
      <nav className="navbar">
              {/* Left: Logo & Sidebar Toggle */}
              <div className="nav-left">
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
    </div>
  )
}

export default UserNavbar
