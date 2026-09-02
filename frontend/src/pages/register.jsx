import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

function Register() {
  const navigate=useNavigate()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        email,
        username,
        password,
      });
      navigate(`/otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button className="register-btn" type="submit">
          Submit
        </button>
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
      </form>
    </div>
  );
}

export default Register;
