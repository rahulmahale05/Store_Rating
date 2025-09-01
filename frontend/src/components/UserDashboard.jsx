import React, { useEffect, useState } from "react";
import "../styles/UserDashboard.css";

const UserDashboard = ({ user }) => {
  const [vendors, setVendors] = useState([]);
  const [ratings, setRatings] = useState({});
  const [avgRates, setAvgRates] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState(""); // search state

  // Fetch vendors and ratings on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("http://localhost:5000/vendors");
        const data = await res.json();
        setVendors(data);

        // Fetch average ratings and user's ratings in parallel
        const avgRatings = {};
        const userRats = {};
        await Promise.all(
          data.map(async (vendor) => {
            const avgRes = await fetch(
              `http://localhost:5000/vendors/${vendor.storeId}/average-rating`
            );
            const avgData = await avgRes.json();
            avgRatings[vendor.storeId] = Number(avgData.averageRating) || 0;

            const userRes = await fetch(
              `http://localhost:5000/vendors/${vendor.storeId}/user-rating/${user.id}`
            );
            const userData = await userRes.json();
            userRats[vendor.storeId] = userData.rating || 0;
          })
        );

        setAvgRates(avgRatings);
        setUserRatings(userRats);
      } catch (err) {
        console.error("Error fetching vendors or ratings:", err);
      }
    };

    fetchVendors();
  }, [user.id]);

  // Handle rating selection before submission
  const handleRatingChange = (vendorId, value) => {
    setRatings({ ...ratings, [vendorId]: value });
  };

  // Handle rating submission
  const handleSubmitRating = async (vendorId) => {
    const ratingValue = ratings[vendorId];
    if (!ratingValue) return alert("Please select a rating!");

    try {
      await fetch(`http://localhost:5000/vendors/${vendorId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingValue, userId: user.id }),
      });

      alert("Rating submitted successfully!");

      const avgRes = await fetch(
        `http://localhost:5000/vendors/${vendorId}/average-rating`
      );
      const avgData = await avgRes.json();
      setAvgRates((prev) => ({
        ...prev,
        [vendorId]: Number(avgData.averageRating) || 0,
      }));

      setUserRatings((prev) => ({
        ...prev,
        [vendorId]: ratingValue,
      }));
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  // Filter vendors based on search (case insensitive)
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.storeName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.storeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Stores List</h1>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by Store Name, Owner Name, or Store ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <div className="vendors-grid">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div key={vendor.storeId} className="vendor-card">
              <h2 className="vendor-name">{vendor.storeName}</h2>

              {/* Store ID Badge */}
              <p className="vendor-id">
                <strong>ID : </strong> <span className="id-badge">{vendor.storeId}</span>
              </p>

              <p className="vendor-info">
                <strong>Owner:</strong> {vendor.ownerName}
              </p>
              <p className="vendor-info">
                <strong>Address:</strong> {vendor.storeAddress}
              </p>
              <p className="vendor-info">
                <strong>Current Rating:</strong>{" "}
                {avgRates[vendor.storeId]?.toFixed(2) || "Not rated"}
              </p>
              <p className="vendor-info">
                <strong>Your Rating:</strong>{" "}
                {userRatings[vendor.storeId] || "Not rated"}
              </p>

              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${
                      (ratings[vendor.storeId] ||
                        userRatings[vendor.storeId]) >= star
                        ? "filled"
                        : ""
                    }`}
                    onClick={() =>
                      handleRatingChange(vendor.storeId, star)
                    }
                  >
                    &#9733;
                  </span>
                ))}
              </div>

              <button
                className="submit-btn"
                onClick={() => handleSubmitRating(vendor.storeId)}
              >
                Submit Rating
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No vendors found</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
