import jwt from "jsonwebtoken";

 const validateToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies or header
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user data to request
    req.user = decoded  ;

    // 4️⃣ Continue to next middleware
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
export default validateToken
