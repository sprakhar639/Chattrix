import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();

  const handleOtp = async (event) => {
    event.preventDefault();
    const email = searchParams.get("email");
    try {
      const response = await api.post("/auth/verify", { otp, email });
      navigate("/me");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Email Verify</h1>
      <form onSubmit={handleOtp}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <br />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default Otp;
