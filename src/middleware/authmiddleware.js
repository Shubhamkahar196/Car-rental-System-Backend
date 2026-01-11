import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.header.authorization;
// checking authorization
  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];
// checking token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token missing after Bearer",
    });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token invalid",
    });
  }
};
