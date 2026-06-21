import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3030/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="background-blur blur-1"></div>
      <div className="background-blur blur-2"></div>

      <div className="login-wrapper">
        <div className="hero-section">
          <h1 className="title">
            Collaborative Whiteboard
          </h1>

          <p className="subtitle">
            Draw, Collaborate and Share Ideas
            in Real Time
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

          <p className="register-link">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}