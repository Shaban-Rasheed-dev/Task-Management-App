import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context_API/auth";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Users = () => {
  const { token } = useAuth();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllusers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/users/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersData(response.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getAllusers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    console.log("Token:", token);
    const confirmDelete = window.confirm("Are you sure want to delete this");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/users/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setUsersData((prevUser) =>
          prevUser.filter((user) => user._id !== userId),
        );
        toast.success("User deleted successfully");
      }
    } catch (error) {
      toast.error(error.message);
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
        <h1 className="text-2xl font-bold my-1">All Users</h1>
        <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
          <Link to="/user/add"> Add User</Link>
        </button>
      </div>
      <hr className="my-1" />
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Profile
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                CREATED AT
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                UPDATED AT
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-gray-600 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {usersData.length > 0 ? (
              usersData.map((user, index) => (
                <tr
                  key={user._id || index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 ">
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 ">
                    {new Date(user.updatedAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                        <Link to={`/user/edit/${user._id}`}>
                          <FaEdit />
                        </Link>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
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
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
