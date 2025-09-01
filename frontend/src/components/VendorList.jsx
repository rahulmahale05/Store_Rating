import React, { useState, useEffect } from "react";
import "../styles/VendorList.css";

const VendorList = ({ isSidebarOpen }) => {
  const [vendors, setVendors] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [search, setSearch] = useState("");

  // Fetch vendors from backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("http://localhost:5000/vendors");
        const data = await res.json();
        setVendors(data);

        // Fetch average ratings for all vendors in parallel
        const ratingsObj = {};
        await Promise.all(
          data.map(async (vendor) => {
            const avgRes = await fetch(
              `http://localhost:5000/vendors/${vendor.storeId}/average-rating`
            );
            const avgData = await avgRes.json();
            ratingsObj[vendor.storeId] = Number(avgData.averageRating) || 0;
          })
        );
        setAvgRatings(ratingsObj);
      } catch (err) {
        console.error("Error fetching vendors or ratings:", err);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on search input
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.storeName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.storeId.toLowerCase().includes(search.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`vendor-list-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <h2>📋 Registered Vendors</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="🔍 Search by Owner Name, Store Name, or Store ID..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="vendor-table-wrapper">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Owner Name</th>
              <th>Store Name</th>
              <th>Store ID</th>
              <th>Address</th>
              <th>Rating ⭐</th>
              <th>Created At 📅</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor, index) => (
                <tr key={index}>
                  <td>{vendor.ownerName}</td>
                  <td>{vendor.storeName}</td>
                  <td>{vendor.storeId}</td>
                  <td>{vendor.storeAddress}</td>
                  <td>
                    {avgRatings[vendor.storeId] != null
                      ? avgRatings[vendor.storeId].toFixed(2)
                      : "Not rated"}
                  </td>
                  <td>{formatDate(vendor.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-vendors">
                  🚫 No matching vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorList;
