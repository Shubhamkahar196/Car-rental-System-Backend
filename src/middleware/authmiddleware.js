import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  /*  Authorization header missing */
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: "Authorization header missing",
    });
  }

  /*  Must start with Bearer */
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Token missing after Bearer",
    });
  }

  const token = authHeader.split(" ")[1];

  /*  Token missing */
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token missing after Bearer",
    });
  }

  /*  Verify token */
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
