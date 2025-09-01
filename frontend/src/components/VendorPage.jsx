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
        <textarea
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

      {/* Vendor List Preview */}
      {vendors.length > 0 && (
        <div className="vendor-list">
          <h3>📋 Registered Vendors</h3>
          <table>
            <thead>
              <tr>
                <th>Store Owner</th>
                <th>Store Name</th>
                <th>Store ID</th>
                <th>Store Address</th>
                <th>Password</th> {/* show password column */}
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.ownerName}</td>
                  <td>{vendor.storeName}</td>
                  <td>{vendor.storeId}</td>
                  <td>{vendor.password}</td> {/* display password */}
                  <td>{vendor.storeAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
