import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import "./Header.css";

const API_URL = "http://127.0.0.1:8000/api/profile/?id=1"; // Replace '1' dynamically

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ first_name: "", last_name: "", email: "" });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API_URL);
        setUser(response.data);
        setUpdatedUser(response.data); // Store for editing
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await axios.put(API_URL, updatedUser); // Send updated data
      setUser(updatedUser); // Update state
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <header className="header">
      <h1 className="logo">My Social App</h1>

      <div className="header-icons">
        {/* Notification Bell */}
        <div className="notification">
          <FaBell className="bell-icon" />
          <span className="notification-count">3</span>
        </div>

        {/* Profile Icon - Click to Show Popup */}
        <div className="profile" onClick={() => setShowProfile(!showProfile)}>
          <FiUser className="profile-icon" />
        </div>
      </div>

      {/* Profile Popup */}
      {showProfile && user && (
        <div className="profile-popup">
          <div className="profile-content">
            <h3>User Profile</h3>

            {editMode ? (
              <>
                <label>Name:</label>
                <input type="text" name="first_name" value={updatedUser.first_name} onChange={handleInputChange} />
                <input type="text" name="last_name" value={updatedUser.last_name} onChange={handleInputChange} />

                <label>Email:</label>
                <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />

                <button onClick={handleUpdateProfile}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={() => setEditMode(true)}>Update Profile</button>
              </>
            )}

            <button onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
