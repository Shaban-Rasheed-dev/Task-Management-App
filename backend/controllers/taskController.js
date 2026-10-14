import { Task } from "../models/taskModel.js";

//create a task  function
export const createTask = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categoryId,
      assignedToId,
      reporterId,
      workingHours,
    } = req.body;

    if (!name || !description || !categoryId || !assignedToId || !reporterId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = await Task.create({
      name,
      description,
      categoryId,
      assignedToId,
      reporterId,
      workingHours,
      createdBy: req.user._id,
    });
    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

// all task fetched logic function
export const allTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ isDeleted: false })

      .populate("categoryId", "categoryName")
      .populate("assignedToId", "name email")
      .populate("reporterId", "name email");
    res.status(200).json({
      success: true,
      message: "All tasks fetched",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

//getOne task logic function
export const getOneTask = async (req, res, next) => {
  try {
    const oneTask = await Task.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("categoryId", "categoryName")
      .populate("assignedToId", "name email")
      .populate("reporterId", "name email");

    if (!oneTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, oneTask });
  } catch (error) {
    next(error);
  }
};

//update the task logic function
export const updateTask = async (req, res, next) => {
  try {
    const { name, description, categoryId, assignedToId, reporterId, status } =
      req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        name,
        description,
        categoryId,
        assignedToId,
        reporterId,
        status,
        updatedBy: req.user._id,
      },
      { returnDocument: "after" },
    )
      .populate("categoryId", "categoryName")
      .populate("assignedToId", "name email")
      .populate("reporterId", "name email");

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

//delete task logic function
export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedBy: req.user._id },
      { returnDocument: "after" },
    );

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//start time logic
export const startTime = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    // sirf assigned employee hi apna task start kar sakta hai
    if (task.assignedToId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your task" });
    }
    task.status = "in-progress";
    task.startTime = new Date();
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task has been started", task });
  } catch (error) {
    next(error);
  }
};

//end time task logic
export const endTime = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, isDeleted: false });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // sirf assigned employee hi apna task start kar sakta hai
    if (task.assignedToId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your task" });
    }

    task.endTime = new Date();
    task.status = "completed";
    const hourTaken = (task.endTime - task.startTime) / (1000 * 60 * 60);
    if (hourTaken <= task.workingHours) {
      task.excellent = true;
    }
    await task.save();

    res.status(200).json({ success: true, message: "Task completed", task });
  } catch (error) {
    next(error);
  }
};
