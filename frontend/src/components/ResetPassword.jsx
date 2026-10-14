import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { MdLock } from "react-icons/md";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Background state values from VerifyOtp page
  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Security check: Direct page visit validation
    if (!email || !resetToken) {
      toast.error("Unauthorized request. Please start the process again.");
      return navigate("/forgot-password");
    }

    if (!newPassword) {
      toast.error("Please enter your new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email, // Background value
          resetToken, // Temporary secure proof token
          newPassword, // User input
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Set a new password for{" "}
          <span className="font-semibold text-[#6358DC]">
            {email || "your account"}
          </span>
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* New Password Input */}
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <MdLock className="text-gray-400 dark:text-gray-300" />
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <MdLock className="text-gray-400 dark:text-gray-300" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </Link>

            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
