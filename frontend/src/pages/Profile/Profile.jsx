import React, { useState, useEffect } from "react";
import { authAPI } from "../../services/api";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", bio: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await authAPI.getProfile();
        const data = response.data.data || response.data;

        setUser({
          name: data.companyname || "User",
          email: data.email || "",
          bio: data.bio || "",
        });

      } catch (error) {
        console.error("Failed to fetch profile:", error.response?.data || error.message);
        setMessage("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitial(user.name)}
          </div>
          <h2>{user.name}</h2>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Company Name</label>
              <p className="form-value">{user.name}</p>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <p className="form-value">{user.email}</p>
            </div>

            {message && <p className="form-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;