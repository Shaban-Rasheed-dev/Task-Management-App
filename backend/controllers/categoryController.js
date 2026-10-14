import { Category } from "../models/categoryModel.js";

//category creation
export const createCategory = async (req, res, next) => {
  const { categoryName } = req.body;
  try {
    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exist" });
    }
    const category = await Category.create({
      categoryName,
      createdBy: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

//read All category
export const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// readOne category
export const getOneCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

//update category
export const updateCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { returnDocument: "after" },
    );
    res.status(200).json({
      success: true,
      message: "Category has been updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

//delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category has been deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
