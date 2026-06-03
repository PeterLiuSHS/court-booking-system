import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Unable to connect to backend server.");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Register</h1>

      <form
        onSubmit={handleRegister}
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "8px 0 16px 0",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              ...inputStyle,
              margin: 0,
              flex: 1,
            }}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#93c5fd",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Register
        </button>

        <p style={{ marginTop: "16px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#93c5fd" }}>
            Login here
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
  backgroundColor: "#16a34a",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

export default RegisterPage;
