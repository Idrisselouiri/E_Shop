import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";
export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(404, "Unauthorized"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, userId) => {
    if (error) {
      return next(errorHandler(403, "Unauthorized"));
    }
    req.user = userId;
    next();
  });
};
