import bcryptjs from "bcryptjs";
import User from "../models/auth.model.js";

export const signinUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json("User has been created");
  } catch (error) {
    next(error);
  }
};
