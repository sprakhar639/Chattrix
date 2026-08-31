import { useState } from "react";
import {Link,useNavigate} from 'react-router-dom'
import api from '../api/axios'

function login() {
    const navigate=useNavigate()
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async (event) => {
    event.preventDefault();
    try {
      const data = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };
      const response = await api.post("/auth/login", data);
      alert("Logged in successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handlelogin}>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <button className="login-btn"  type="submit">LOGIN</button>
        <p>Don't have account<br/><button className="register-btn" onClick={()=>navigate("/register")}>Register</button> </p>
       
      </form>
    </div>
  );
}

export default login;
