import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../Context_API/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const TaskList = () => {
  const { token, role } = useAuth();
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  //state for editing modal
  const [editing, setEditing] = useState(null);
  //navigation
  const navigate = useNavigate();

  const getTaskList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/tasks/alltasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setTaskList(response.data.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (token) {
      getTaskList();
    }
  }, [token]);

  //deleting functionality
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure want to delete this");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `${backendUrl}/api/tasks/delete/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        setTaskList((prev) => prev.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  //start the task of employee
  const handleStartTask = async (taskId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/tasks/start/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        toast.success("Task started");
        getTaskList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // employee task complete kare
  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/tasks/end/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        toast.success("Task completed");
        getTaskList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold my-1">All Tasks</h1>
        {role !== "employee" && (
          <button
            onClick={() => setIsAddModelOpen(true)}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Add Task
          </button>
        )}
      </div>
      <hr className="my-1" />
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Reporter
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                createdat
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                updatedat
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Excellent
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {taskList.length > 0 ? (
              taskList.map((task, index) => (
                <tr
                  key={task._id || index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td
                    className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium cursor-pointer"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                  >
                    {task.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {task.categoryId?.categoryName || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {task.assignedToId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {task.reporterId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {task.status}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(task.updatedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {task.status === "completed" ? (
                      task.excellent ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                          Excellent
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-semibold">
                          Late
                        </span>
                      )
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {role === "employee" ? (
                        <>
                          {task.status === "pending" && (
                            <button
                              onClick={() => handleStartTask(task._id)}
                              className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                            >
                              Start
                            </button>
                          )}
                          {task.status === "in-progress" && (
                            <button
                              onClick={() => handleCompleteTask(task._id)}
                              className="px-3 py-1 text-sm rounded bg-purple-500 text-white hover:bg-purple-600 cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {task.status === "completed" && (
                            <span className="text-sm text-gray-500">Done</span>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditing(task._id)}
                            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                          >
                            <MdDelete />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No Task found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add task modal */}
      {isAddModelOpen && (
        <AddTaskModal
          onClose={() => setIsAddModelOpen(false)}
          onAdded={getTaskList}
        />
      )}

      {/* Edit task modal */}
      {editing && (
        <EditTaskModal
          taskId={editing}
          onClose={() => setEditing(null)}
          onUpdated={getTaskList}
        />
      )}
    </>
  );
};
