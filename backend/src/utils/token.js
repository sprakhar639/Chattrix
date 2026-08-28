import jwt from "jsonwebtoken";

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return refreshToken;
}

function generateAccessToken(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  return accessToken;
}

export { generateRefreshToken, generateAccessToken };
