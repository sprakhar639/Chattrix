import {register} from "../services/auth.service.js";


async function userRegister(req, res) {
  try {
    const user = await register(req.body);

    return res.status(201).json({ message: "User Registered Successfully",user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { userRegister };
