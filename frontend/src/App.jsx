import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./components/Users";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Edituser } from "./components/Edituser";
import { AddUser } from "./components/AddUser";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyOtp } from "./components/VerifyOtp";
import { ResetPassword } from "./components/ResetPassword";
import { Category } from "./components/Category";

import { TaskList } from "./components/Task/TaskList";
import { TaskDetail } from "./components/Task/TaskiDetail";

function App() {
  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Navbar />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/edit/:id" element={<Edituser />} />
            <Route path="/user/add" element={<AddUser />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
