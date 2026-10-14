import axios from "axios";
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../Context_API/auth";
import { Link } from "react-router-dom";
export const Login = () => {
  const { storeTokeninLS } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogin({ ...login, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // console.log(login);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        ...login,
        rememberMe,
      });
      // console.log("Sending to backend:", { ...login, rememberMe });
      if (response.data.success) {
        storeTokeninLS(response.data.token);
        setLogin({ email: "", password: "" });
        toast.success("Login successfull!");
        navigate("/dashboard");
      }
      // console.log(response);
    } catch (error) {
      const errorMessage =
        error.response?.data?.extraDetails ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col sm:flex-row gap-10 my-5 ">
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
          <img
            className=" w-full max-w-[440px] h-auto object-cover"
            src="images/register.png"
            alt=""
          />
        </div>

        {/* right side section */}
        <div className="w-full sm:w-1/2 bg-white mb-5  p-5 sm:p-10">
          <h1 className="text-3xl font-semibold">Welcome to</h1>
          <h2 className="text-2xl font-extrabold text-[#6358DC]">
            Task Management
          </h2>
          <form onSubmit={handleFormSubmit} action="">
            <div className="flex gap-5 my-3 bg-gray-100 p-3 rounded items-center">
              <div>
                <MdEmail />
              </div>
              <input
                onChange={handleChange}
                value={login.email}
                name="email"
                className="outline-none"
                type="email"
                placeholder="Enter email.."
              />
            </div>
            <div className="flex gap-5 my-3 bg-gray-100 p-3 rounded items-center">
              <div>
                <RiLockPasswordFill />
              </div>
              <input
                onChange={handleChange}
                value={login.password}
                name="password"
                className="outline-none"
                type="password"
                placeholder="Enter password.."
              />
            </div>
            <button
              className="px-3 py-2 bg-[#6358DC] text-white rounded w-full cursor-pointer"
              type="submit"
            >
              Login Now
            </button>
            <div className="flex items-center justify-between w-full mt-3">
              <label className="flex items-center cursor-pointer">
                <input
                  onChange={(e) => setRememberMe(e.target.checked)}
                  checked={rememberMe}
                  className="mr-2 cursor-pointer"
                  type="checkbox"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#6358DC] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          {/* link for login page redirect */}
          <p className="my-3 ">
            Din't have an account?
            <Link to="/" className="text-[#6358DC] mx-1" href="#">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
