import { useState } from "react";
import "../styles/VendorPage.css";

const VendorPage = ({ isSidebarOpen }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    storeName: "",
    storeId: "",
    storeAddress: "",
    password: "", // added password
  });

  const [vendors, setVendors] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ownerName ||
      !formData.storeName ||
      !formData.storeId ||
      !formData.storeAddress ||
      !formData.password // check password
    ) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Vendor Registered Successfully!");
        setVendors([...vendors, formData]);
        setFormData({
          ownerName: "",
          storeName: "",
          storeId: "",
          storeAddress: "",
          password: "", // reset password
        });
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to register vendor");
    }
  };

  return (
    <div className={`vendor-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <h2>➕ Register New Vendor</h2>

      <form className="vendor-form" onSubmit={handleSubmit}>
        <label>Store Owner Name</label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="Enter owner's name"
        />

        <label>Store Name</label>
        <input
          type="text"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          placeholder="Enter store name"
        />

        <label>Store ID</label>
        <input
          type="text"
          name="storeId"
          value={formData.storeId}
          onChange={handleChange}
          placeholder="Enter unique store ID"
        />

        <label>Store Address</label>
        <input
          type="text"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={handleChange}
          placeholder="Enter store address"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />

        <button type="submit" className="btn-submit">Register Vendor</button>
      </form>
    </div>
  );
};

export default VendorPage;
