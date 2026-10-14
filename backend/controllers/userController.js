import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

//craete users
// create user
export const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const defaultPassword = Math.random().toString(36).slice(-8);
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRound);

    const newUser = await User.create({
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ success: true, message: "User Saved", user: newUser });
  } catch (error) {
    next(error);
  }
};

//read users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select({ password: 0 });
    //   check if user not found
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No  User Found" });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

//get all user for dropdown
export const getUsersForDropdown = async (req, res, next) => {
  try {
    const allUsersInDropdown = await User.find({}, "name email");
    res.status(200).json({ success: true, allUsersInDropdown });
  } catch (error) {
    next(error);
  }
};

export const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

//update user
export const getUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updateData = { name, email };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.image = result.secure_url;
    }

    const updateUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updateUser,
    });
  } catch (error) {
    next(error);
  }
};

//delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
