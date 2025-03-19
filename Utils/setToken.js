import jwt from "jsonwebtoken";
const setToken = (res, userFound) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });
  const days = parseInt(expiresIn) || 7;
  const cookieExpirationTime = days * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(Date.now() + cookieExpirationTime);
  const options = {
    expires: expirationDate, // Sync with token expiration
    httpOnly: true, // Secure cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "None",
  };

  res.cookie("token", token, options);
  return token;
};

export default setToken;
