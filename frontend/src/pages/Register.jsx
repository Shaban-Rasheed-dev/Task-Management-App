import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onchangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(user);
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        user,
      );

      if (response.data.success) {
        setUser({ name: "", email: "", password: "" });
        toast.success("Registered successfully!");
        navigate("/login");
      }
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
                <FaUser />
              </div>

              <input
                name="name"
                onChange={onchangeHandler}
                value={user.name}
                className="outline-none"
                type="text"
                placeholder="Enter yourname.."
              />
            </div>
            <div className="flex gap-5 my-3 bg-gray-100 p-3 rounded items-center">
              <div>
                <MdEmail />
              </div>
              <input
                name="email"
                onChange={onchangeHandler}
                value={user.email}
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
                name="password"
                onChange={onchangeHandler}
                value={user.password}
                className="outline-none"
                type="password"
                placeholder="Enter password.."
              />
            </div>
            <button
              className="px-3 py-2 bg-[#6358DC] text-white rounded w-full cursor-pointer"
              type="submit"
            >
              Register Now
            </button>
          </form>

          {/* link for login page redirect */}
          <p className="my-3 ">
            Already have an account?
            <Link to="/login" className="text-blue-600 mx-1 cursor-pointer">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
