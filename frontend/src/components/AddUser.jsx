import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context_API/auth";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const AddUser = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState({
    name: "",
    email: "",
  });
  const [image, setImage] = useState(null);

  const handleInputChnage = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUsers({ ...users, [name]: value });
  };

  const handleImageChnage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", users.name);
      formData.append("email", users.email);
      if (image) {
        formData.append("image", image);
      }
      const response = await axios.post(
        `${backendUrl}/api/users/adduser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.success) {
        toast.success("User added successfully");
        navigate("/users");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className=" flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <Link
            to="/users"
            className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-[#6358DC] mb-6 text-sm w-fit"
          >
            <FaArrowLeft />
            Back to Users
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            Add User
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Add the user's details below
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
              <FaUser className="text-gray-400 dark:text-gray-300" />
              <input
                onChange={handleInputChnage}
                value={users.name}
                name="name"
                className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
                type="text"
                placeholder="Enter name.."
              />
            </div>

            <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
              <MdEmail className="text-gray-400 dark:text-gray-300" />
              <input
                onChange={handleInputChnage}
                value={users.email}
                name="email"
                className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
                type="email"
                placeholder="Enter email.."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Profile Image
              </label>
              <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
                <input
                  onChange={handleImageChnage}
                  name="image"
                  className="outline-none bg-transparent w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#6358DC] file:text-white file:cursor-pointer cursor-pointer"
                  type="file"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to="/users"
                className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </Link>
              <button
                className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium"
                type="submit"
              >
                Save User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
