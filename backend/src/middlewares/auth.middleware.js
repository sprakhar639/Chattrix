async function isTokenCorrect(req, res, next) {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(404).json({ message: "Token not exist" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export { isTokenCorrect };
