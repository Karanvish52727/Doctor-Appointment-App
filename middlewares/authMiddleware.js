import jwt from "jsonwebtoken";


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    } else {
      //JWT varification
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //attach user ID to the request
      req.body = req.body || {};
      req.body.userId = decode.id;
      next();
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
      error:error.message,
    });
  }
};

export default authMiddleware;
