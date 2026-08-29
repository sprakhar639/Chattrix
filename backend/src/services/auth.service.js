import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import otpModel from "../models/otp.model.js";
import { sendMail } from "./mail.service.js";
import { generateOtp, getOtpHtml } from "../utils/otp.js";

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
  console.log(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    email,
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendMail(email, "OTP Verification", `Your OTP  code is ${otp}`, html);

  return user;
}

async function login({ username, email, password }) {
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

  return { user, refreshToken, accessToken };
}

async function verify({ email, otp }) {
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

  const user = await userModel.findByIdAndUpdate(otpDoc.userId, {
    verified: true}, { new: true }
  );

  return user;
}
export { register, login, verify };
