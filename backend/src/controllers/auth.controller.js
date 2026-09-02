import {
  register,
  login,
  verify,
  newTokens,
} from "../services/auth.service.js";

async function userRegister(req, res) {
  try {
    const { user, refreshToken, accessToken } = await register(
      req.body);

    return res
      .status(200)
      .json({ messsage: "User Registed successfully", user});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
}
async function userLogin(req, res) {
  try {
    const { user, accessToken, refreshToken } = await login({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.cookie("token", refreshToken, { httpOnly: true });
    return res
      .status(200)
      .json({ messsage: "User logged In successfully", user, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: error.message,
    });
  }
}
async function verifyMail(req, res) {
  try {
    const {refreshToken} = await verify({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    res.cookie("token",refreshToken)

     return res.status(201)
      .json({ message: "User registed Succeesfully" },);
  } catch (error) {
    console.error(error);
  }
}
async function refreshToken(req, res) {
  const oldRefreshToken = req.cookies.token;
  const { refreshToken } = await newTokens(oldRefreshToken);
  res.cookie("token", refreshToken);
}

export { userRegister, userLogin, verifyMail, refreshToken };
