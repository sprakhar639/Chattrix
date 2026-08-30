import { myself } from "../services/user.service.js";

async function getMe(req, res) {
  const userId = req.user.id;
  const user = await myself(userId);
  res.status(200).json({ message: "User fetched successsfully" });
}

export { getMe };
