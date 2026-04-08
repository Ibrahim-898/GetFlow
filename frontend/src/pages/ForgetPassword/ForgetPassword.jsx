import React, { useState } from "react";
import { authAPI } from '../../services/api';
import { useNavigate } from "react-router-dom";
import './ForgetPassword.css'; // ✅ import css

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.forgetPassword(email);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/update-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forget-container">
      <h2>Forget Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPassword;