import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup

  // Signup state
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        navigate("/wallet"); // Redirect to wallet page
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during login.");
    }
  };

  // Handle Signup
  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, mobile, username, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        alert("Account created successfully!");
        setIsSignup(false); // Switch back to login form after successful signup
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="container">
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${!isSignup ? "active" : ""}`}
          onClick={() => setIsSignup(false)}
        >
          Login
        </button>
        <button
          className={`toggle-btn ${isSignup ? "active" : ""}`}
          onClick={() => setIsSignup(true)}
        >
          Create Account
        </button>
      </div>

      {isSignup ? (
        // Signup Form
        <form className="login-form" onSubmit={handleSignup}>
          <input type="text" placeholder="First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-btn">Create Account</button>
        </form>
      ) : (
        // Login Form
        <form className="login-form" onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-btn">Login</button>
        </form>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default LoginPage;
