import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context_API/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const TaskDetail = () => {
  const { id } = useParams(); // URL se task ki ID nikali
  const { token } = useAuth();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // task ki detail fetch karo
  const fetchTask = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/tasks/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(response.data.oneTask);
    } catch (error) {
      console.log(error);
    }
  };

  // is task ke comments fetch karo
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  // naya comment submit karo
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Comment can't be empty");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/comments/create`,
        { taskId: id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        setNewMessage(""); // input khaali karo
        fetchComments(); // list refresh karo taake naya comment dikhe
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // page load hote hi dono fetch karo
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTask(), fetchComments()]).finally(() =>
      setLoading(false),
    );
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return <p className="text-center p-10">Task not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      {/* Task Detail Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-5">
        <h1 className="text-2xl font-bold mb-2">{task.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          {task.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Working Hours:</strong> {task.workingHours}
          </p>
          <p>
            <strong>Assigned To:</strong> {task.assignedToId?.name}
          </p>
          <p>
            <strong>Reporter:</strong> {task.reporterId?.name}
          </p>
        </div>
        {task.status === "completed" && (
          <div className="mt-2">
            Complete Status:
            {task.excellent ? (
              <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                Excellent ⭐
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-semibold">
                Late ⏰
              </span>
            )}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
        <h2 className="text-lg font-bold mb-3">Comments</h2>

        <div className="flex flex-col gap-3 mb-4 max-h-80 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-100 dark:bg-gray-700 rounded p-3"
              >
                <p className="text-sm font-semibold">
                  {comment.userId?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {comment.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}
        </div>

        {/* Naya comment form */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded px-3 py-2 dark:bg-gray-700"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-[#6358DC] text-white rounded hover:bg-[#5147c4] disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};
