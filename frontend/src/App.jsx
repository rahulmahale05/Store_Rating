import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import Navbar from "./components/Navbar";
import { set } from "react-hook-form";
import UserNavbar from "./components/UserNavbar";
import VendorDashboard from "./components/VendorDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [admin, setAdmin] = useState(false);

  if(user) 
    return <>
      <UserNavbar setPage={setPage} setUser={setUser}/>
      <UserDashboard user={user}/>
    </>;
  else if(vendor)
    return <>
      <UserNavbar setPage={setPage} setUser={setVendor}/>
      <VendorDashboard storeId={vendor.storeId}/>
    </>
  else
    return (
    <div>
      {admin ? (
        <>
        <Navbar setPage={setPage} setAdmin={setAdmin} />
        </>
      ) : page === "login" ? (
        <Login
          onLoginSuccess={(userData,vendorData) => {
            setUser(userData);
            setVendor(vendorData);
            setPage("dashboard"); // go to dashboard after login
          }}
          setAdmin={setAdmin}
          onSwitchToRegister={() => setPage("register")}
        />
      ) : (
        <Register onSwitchToLogin={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;

