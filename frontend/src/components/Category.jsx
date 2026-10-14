import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context_API/auth";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { EditCategoryModel } from "./EditCategoryModel";
import { AddCategoryModal } from "./AddCategoryModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Category = () => {
  const { token } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState(null); // kis category ko edit karna hai
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // add modal open hai ya nahi

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategoryData(response.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (token) {
      getAllCategories();
    }
  }, [token]);

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure want to delete this");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/categories/delete/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCategoryData((prevCategory) =>
          prevCategory.filter((cat) => cat._id !== categoryId),
        );
        toast.success("Category deleted successfully");
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
        <h1 className="text-2xl font-bold my-1">All Categories</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        >
          Add Category
        </button>
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
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Updated At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categoryData.length > 0 ? (
              categoryData.map((cat, index) => (
                <tr
                  key={cat._id || index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">
                    {cat.categoryName}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {cat.createdBy?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(cat.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(cat.updatedAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategoryId(cat._id)}
                        className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal - sirf tab render hoga jab editingCategoryId set ho */}
      {editingCategoryId && (
        <EditCategoryModel
          categoryId={editingCategoryId}
          onClose={() => setEditingCategoryId(null)}
          onUpdated={getAllCategories}
        />
      )}

      {/* Add modal - sirf tab render hoga jab isAddModalOpen true ho */}
      {isAddModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddModalOpen(false)}
          onAdded={getAllCategories}
        />
        
      )}
    </>
  );
};
