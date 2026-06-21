import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { API_URL } from "../../config";
function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="background-blur blur-1"></div>
      <div className="background-blur blur-2"></div>

      <div className="register-wrapper">
        <div className="hero-section">
          <h1 className="title">
            Collaborative Whiteboard
          </h1>

          <p className="subtitle">
            Create an account and start collaborating
            with your team in real time.
          </p>
        </div>

        <form className="register-card" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
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
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}
          {success && (
            <p className="success">
              {success}
            </p>
          )}

          <button type="submit">
            Register
          </button>

          <p className="register-link">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Register;