import React, { useState, useEffect } from "react";
import api from "../../services/api";
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", bio: "" });
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/auth/profile"); // Axios handles token
        console.log("Profile response:", response.data);

        // Support backend returning either { data: {...} } or {...}
        const data = response.data.data || response.data;

        setUser({
          name: data.companyname || "User",
          email: data.email || "",
          bio: data.bio || "",
        });

        setFormData({
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const response = await api.put("/auth/profile", formData);
      setUser({ ...formData });
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      setMessage("Failed to update profile");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
    setMessage("");
  };

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // Helper to show initials if no avatar
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">{getInitial(user.name)}</div>
          <h2>{user.name}</h2>

        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
            {!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{user.name}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled // Prevent editing email if you want
                />
              ) : (
                <p className="form-value">{user.email}</p>
              )}
            </div>

            {isEditing && (
              <div className="form-buttons">
                <button className="btn-save" onClick={handleSave}>Save</button>
                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              </div>
            )}

            {message && <p className="form-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;