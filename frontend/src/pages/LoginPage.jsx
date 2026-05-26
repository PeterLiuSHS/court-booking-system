import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      setCurrentUser(data.user);
      
      const pendingBooking = localStorage.getItem("pendingBooking");

      if (pendingBooking){
        navigate("/reserve");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to backend server.");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Login</h1>

      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Login
        </button>

        <p style={{ marginTop: "16px" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "#93c5fd" }}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  margin: "8px 0 16px 0",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  border: "none",
  borderRadius: "10px",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default LoginPage;