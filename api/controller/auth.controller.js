import bcryptjs from "bcryptjs";
import User from "../models/auth.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const signinUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(404, "All fields are required"));
  }
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

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  const validUser = await User.findOne(email);
  if (!validUser) {
    return next(errorHandler(404, "User not Found"));
  }
  const validPassword = bcryptjs.compareSync(validUser.password, password);
  if (!validPassword) {
    return next(errorHandler(403, "Passwor not Valid"));
  }
  try {
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
    const { password: pass, ...userInfo } = validUser._doc;
    res.status(200).cookie("access_token", token).json(userInfo);
  } catch (error) {
    next(error);
  }
};
