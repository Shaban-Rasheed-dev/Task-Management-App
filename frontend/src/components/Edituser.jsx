import { Link, useNavigate, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../Context_API/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const Edituser = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [user, setUser] = useState({ name: "", email: "" });
  const [image, setImage] = useState(null); // naya image state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getOneUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/edit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to load user");
    }
  };

  //input changing
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  //image changing
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  //form submit for update logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      if (image) {
        formData.append("image", image); // sirf jab naya image select ho
      }

      const response = await axios.put(
        `${backendUrl}/api/users/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success("User updated Successfully");
        navigate("/users");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getOneUser();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <Link
          to="/users"
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-[#6358DC] mb-6 text-sm w-fit"
        >
          <FaArrowLeft />
          Back to Users
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Edit User
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Update the user's details below
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <FaUser className="text-gray-400 dark:text-gray-300" />
            <input
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              type="text"
              placeholder="Enter name.."
              required
            />
          </div>

          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <MdEmail className="text-gray-400 dark:text-gray-300" />
            <input
              name="email"
              onChange={handleInputChange}
              value={user.email}
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              type="email"
              placeholder="Enter email.."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Profile Image
            </label>

            {/* current image preview agar backend se image mil rahi ho */}
            {user.image && !image && (
              <img
                src={user.image}
                alt="Current profile"
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
            )}

            <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
              <input
                name="image"
                onChange={handleImageChange}
                className="outline-none bg-transparent w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#6358DC] file:text-white file:cursor-pointer cursor-pointer"
                type="file"
                accept="image/*"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Naya image select na karein agar purani hi rakhni hai
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/users"
              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </Link>
            <button
              className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
