import axios from "axios";
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/auth/forgot-password`,
        { email },
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // MAIN FIX: Email ko next page (VerifyOtp) ki state me pass kar diya
        navigate("/verify-otp", { state: { email } });
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
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your registered email address to receive an OTP code.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg items-center focus-within:ring-2 focus-within:ring-[#6358DC] transition">
            <MdEmail className="text-gray-400 dark:text-gray-300" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              className="outline-none bg-transparent w-full text-gray-800 dark:text-gray-100 placeholder-gray-400"
              type="email"
              placeholder="Enter email..."
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </Link>
            <button
              disabled={loading}
              className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
              type="submit"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
