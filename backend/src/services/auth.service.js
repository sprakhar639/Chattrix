import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import otpModel from "../models/otp.model.js";
import { sendMail } from "./mail.service.js";
import { generateOtp, getOtpHtml } from "../utils/otp.js";
import jwt from "jsonwebtoken";

async function register({ username, email, password }) {
  const isalreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isalreadyRegistered) {
    throw new Error("User already Exist");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    email,
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendMail(email, "OTP Verification", `Your OTP  code is ${otp}`, html);

  return { user };
}

async function login({ username, email, password, ip, userAgent }) {
  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");

  if (!user) {
    throw new Error("User not exist");
  }

  if (!user.verified) {
    throw new Error("User not verified");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid Credentials");
  }

  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  
  const refreshTokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");
  
  console.log("UserId=",user._id)
  console.log("RefreshToken=",refreshToken)
  console.log("accessToken=",accessToken)
  console.log("refreshTokenHash=",refreshTokenHash)

  const session = await sessionModel.create({
    userId: user.id,
    refreshTokenHash,
    ip,
    userAgent,
  });

  return { user, refreshToken, accessToken };
}

async function newTokens(oldRefreshToken) {
  if (!oldRefreshToken) {
    throw new Error("Token not found" );
  }
  const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);

  const userId = decoded.id;

  const user = await userModel.findOne({_id:userId});
  console.log("User=",user)



  const oldRefreshTokenHash = crypto
    .createHash("sha256")
    .update(oldRefreshToken)
    .digest("hex");
   

  const refreshTokenHash=oldRefreshTokenHash
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });


  if (!session) {
    throw new Error("Token not found or already revoked");
  }

  const newRefreshToken = generateRefreshToken(user);


  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");
  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();
  console.log("newrefreshTokenHash=",newRefreshTokenHash)
  const newAccessToken = generateAccessToken(user);

  return newRefreshToken;
}

async function verify({ email, otp, ip, userAgent }) {
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpDoc = await otpModel.findOne({
    email,
    otpHash,
  });

  if (!otpDoc) {
    throw new Error("OTP wrong or not found");
  }
  if (otpDoc.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  const user = await userModel.findByIdAndUpdate(
    otpDoc.userId,
    {
      verified: true,
    },
    { new: true },
  );
 // console.log("user=",user)

  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    userId: user.id,
    refreshTokenHash,
    ip,
    userAgent,
  });

  return { refreshToken };
}
export { register, login, verify, newTokens };
