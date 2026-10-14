import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pehli screen se pass hua email receive karein
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Direct route access check
    if (!email) {
      toast.error("Session expired. Please request OTP again.");
      return navigate("/forgot-password");
    }

    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email, // User input nahi kar raha, background state se auto ja raha hai
        otp: otpValue,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // MAIN FIX: Backend se aane wala resetToken aur email next page ko pass kar diya
        navigate("/reset-password", {
          state: {
            email: response.data.email,
            resetToken: response.data.resetToken,
          },
        });
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
          Verify OTP
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-[#6358DC]">
            {email || "your email"}
          </span>
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* OTP Box inputs directly */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-[#6358DC] transition"
              />
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/forgot-password"
              className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Back
            </Link>
            <button
              disabled={loading}
              className="flex-1 px-3 py-2 bg-[#6358DC] text-white rounded-lg hover:bg-[#5147c4] transition cursor-pointer font-medium disabled:opacity-50"
              type="submit"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
