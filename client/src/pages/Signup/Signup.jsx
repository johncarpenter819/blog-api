import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { signupUser } from "../../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={formData.confirm}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
