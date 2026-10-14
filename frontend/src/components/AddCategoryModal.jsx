import { MdCategory } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context_API/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Props: onClose (modal band karne ke liye), onAdded (list refresh karne ke liye)
export const AddCategoryModal = ({ onClose, onAdded }) => {
  const { token } = useAuth();
  const [addCategory, setAddCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/categories`,
        { categoryName: addCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        toast.success("Category added successfully");
        if (onAdded) onAdded(); // list ko turant refresh karo
        onClose(); // modal band karo
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Overlay - bahar click karne se bhi modal close ho jaye
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative"
        onClick={(e) => e.stopPropagation()} // andar click se close na ho
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 transition"
        >
          <IoClose size={22} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Add Category
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Add the category details below
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <MdCategory className="text-gray-400 dark:text-gray-300" />
            <input
              onChange={(e) => setAddCategory(e.target.value)}
              value={addCategory}
              name="categoryName"
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              type="text"
              placeholder="Enter category name.."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
