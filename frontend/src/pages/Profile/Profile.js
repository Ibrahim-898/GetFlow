import React, { useState, useEffect } from 'react';
import { User, Mail, Edit2, Save, X } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from API
  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const responseData = await response.json();   // This will parse it

      // Handle different possible response structures
      let userData = {};

      if (typeof responseData === 'string') {
        // Case 1: Backend sent just a string (e.g. "sihab")
        userData = { name: responseData, email: '' };
      } 
      else if (responseData.data) {
        // Case 2: Backend sent { data: "sihab" } or { data: { name: ..., email: ... } }
        const innerData = responseData.data;

        if (typeof innerData === 'string') {
          userData = { name: innerData, email: '' };
        } else {
          userData = {
            name: innerData.name || innerData.fullName || innerData.username || 'User',
            email: innerData.email || '',
            bio: innerData.bio || '',
          };
        }
      } 
      else {
        // Case 3: Normal object { name: "...", email: "..." }
        userData = {
          name: responseData.name || responseData.fullName || responseData.username || 'User',
          email: responseData.email || '',
          bio: responseData.bio || '',
        };
      }

      setUser(userData);
      setFormData(userData);

    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    try {
      // Replace with your actual update API endpoint
      const response = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUser({ ...formData });
        setIsEditing(false);
        // Optional: dispatch authChange event if needed
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Something went wrong');
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitial(user.name)}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  <Save size={18} /> Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <X size={18} /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Username</label>
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
                />
              ) : (
                <p className="form-value">{user.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;