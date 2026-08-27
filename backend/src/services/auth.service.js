import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

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

  return user;
}

async function login({ username, email, password }) {
  try {
    const user = await userModel
      .findOne({
        $or: [{ email }, { username }],
      })
      .select("+password");

    if (!user) {
      throw new Error("User not exist");
    }

    // if (!user.verified) {
    //   throw new Error("User not verified");
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    return user;
  } catch (error) {
    console.error(error);
  }
}
export { register, login };
