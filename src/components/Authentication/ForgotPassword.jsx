import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Django API URL

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${API_URL}/forgot-password/`, { email });
      setMessage(response.data.message);
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${API_URL}/verify-otp/`, { email, otp, new_password: newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP or email");
    }
  };

  return (
    <div className="auth-container">
      <h2>{step === 1 ? "Forgot Password" : "Verify OTP"}</h2>

      {step === 1 ? (
        // Step 1: Enter Email
        <form className="auth-form" onSubmit={handleRequestOTP}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        // Step 2: Enter OTP & New Password
        <form className="auth-form" onSubmit={handleVerifyOTP}>
          <label>OTP:</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />

          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

          <button type="submit">Reset Password</button>
        </form>
      )}

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="auth-links">
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
