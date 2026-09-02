import { useEffect, useState } from "react";
import api from '../api/axios'

function MyProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const response = await api.get("/user/me");
      setUser(response.data.user);
    };
    fetchProfile();
  }, []);

  return (
    <>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
    </>
  );
}
export default MyProfile;
