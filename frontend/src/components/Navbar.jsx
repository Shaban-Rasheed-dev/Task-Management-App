import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { HiMiniUsers } from "react-icons/hi2";
import { FiSun } from "react-icons/fi";
import { FaMoon } from "react-icons/fa";
import { useAuth } from "../Context_API/auth";
import { toast } from "react-toastify";
import { MdCategory } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { Link, useNavigate, Outlet } from "react-router-dom";

export const Navbar = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logOut();
    toast.success("Logout successfully");
    navigate("/login");
  };

  return (
    <div
      className={`flex bg-gray-100 min-h-screen ${darkMode ? "dark" : ""} dark:bg-gray-900`}
    >
      {/* sidebar */}
      <div
        className={`fixed bg-white w-64 h-screen shadow   transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static dark:bg-gray-900 `}
      >
        <div className="p-4 flex justify-between border-b p-5">
          <div className="text-xl font-bold dark:text-gray-100">
            Task Management
          </div>
          <button
            className="lg:hidden cursor-pointer dark:text-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            X
          </button>
        </div>

        {/* navigation sidebar */}
        <div className="p-4 space-y-2">
          <div className="flex flex-col p-2">
            <Link
              to="/dashboard"
              className=" flex mt-1 mx-2 text-l dark:text-gray-100 hover:bg-gray-100 p-2 dark:hover:text-black"
            >
              <MdDashboard className="mt-1 mx-2" />
              Dashboard
            </Link>
            <Link
              to="/users"
              className=" flex mt-1 mx-2 text-l dark:text-gray-100 hover:bg-gray-100 p-2 dark:hover:text-black "
            >
              <HiMiniUsers className="mt-1 mx-2" />
              Users
            </Link>
            <Link
              to="/categories"
              className=" flex mt-1 mx-2 text-l dark:text-gray-100 hover:bg-gray-100 p-2 dark:hover:text-black "
            >
              <MdCategory className="mt-1 mx-2" />
              Categories
            </Link>
            <Link
              to="/tasks"
              className=" flex mt-1 mx-2 text-l dark:text-gray-100 hover:bg-gray-100 p-2 dark:hover:text-black "
            >
              <FaTasks className="mt-1 mx-2" />
              Tasks
            </Link>
          </div>
        </div>

        {/* dark mode */}
        <div className="flex text-2xl justify-left p-4">
          {darkMode ? (
            <button
              onClick={() => setDarkMode(false)}
              className="bg-black p-2 text-orange-400 rounded-full cursor-pointer"
            >
              <FiSun />
            </button>
          ) : (
            <button
              onClick={() => setDarkMode(true)}
              className="bg-black p-2 text-white rounded-full cursor-pointer"
            >
              <FaMoon />
            </button>
          )}
        </div>
      </div>

      {/* main content */}
      <main className="flex-1">
        <header className="bg-white flex justify-between p-4 dark:bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-xl font-bold lg:hidden dark:text-gray-100"
          >
            <GiHamburgerMenu />
          </button>
          <h1 className="text-2xl font-bold  dark:text-gray-100">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-300 p-2 rounded-lg cursor-pointer  font-bold dark:text-gray-100 dark:bg-gray-800"
          >
            Logout
          </button>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
