import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context_API/auth";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const AddTaskModal = ({ onClose, onAdded }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    assignedToId: "",
    reporterId: "",
    workingHours: "",
  });

  // dropdowns fill karne ke liye lists
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  // submit button disable karne ke liye (double click rokne ke liye)
  const [submitting, setSubmitting] = useState(false);
  //category fetech function
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  // users fetch karne wala function
  const getUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  // input/select change hone pe formData update karo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //submit form logic
  const handleformSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.categoryId ||
      !formData.assignedToId ||
      !formData.reporterId ||
      !formData.workingHours
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      setSubmitting(true);

      const response = await axios.post(
        `${backendUrl}/api/tasks/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        toast.success("Task are created successfuly");
        onAdded();
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // modal khulte hi dono lists fetch ho jayein
  useEffect(() => {
    fetchCategory();
    getUsers();
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add Task</h2>

          <form onSubmit={handleformSubmit} className="flex flex-col gap-3">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              />
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned To
              </label>
              <select
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Reporter</label>
              <select
                name="reporterId"
                value={formData.reporterId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              >
                <option value="">Select Reporter</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Working Hours */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Working Hours
              </label>
              <input
                type="number"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 8"
                className="w-full border rounded px-3 py-2 dark:bg-gray-700"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
