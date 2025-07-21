import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// REMOVED: import Navbar from "../components/Navbar"; // Navbar is now handled by Layout.jsx
import API from "../api/axios"; // axios instance with withCredentials: true
import { Mail, Lock } from 'lucide-react'; // Importing Lucide icons for input fields

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const showCustomModal = (message, type = "success") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      showCustomModal("Email and password are required.", "error");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("✅ Login successful:", res.data);

      showCustomModal("Login successful!", "success");

      setTimeout(() => {
        setShowModal(false);
        navigate("/"); // Navigate to home page after successful login
      }, 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      showCustomModal(
        err.response?.data?.message || "Login failed. Please check credentials.",
        "error"
      );
    }
  };

  return (
    // This div is the root of Login's content. It relies on Layout for overall page styling.
    // The Layout component already provides min-h-screen, bg-gray-50, font-sans, antialiased, and flex-col.
    // It also handles the padding-top for the Navbar and the global footer.
    // REMOVED: flex-1 from here as it's redundant when nested inside Layout's flex-1 main.
    <div className="flex items-center justify-center p-4 py-8 md:py-12">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center transform transition-transform duration-300 scale-100 animate-scale-in">
            <div
              className={`text-3xl mb-4 ${
                modalType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {modalType === "success" ? "✅" : "❌"}
            </div>
            <p className="text-lg text-gray-800 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className={`py-2 px-6 rounded-full font-semibold text-white transition-colors duration-200
                ${
                  modalType === "success"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Main content for the login form */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md border-t-8 border-blue-500 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-800 text-center leading-tight">
          Welcome Back to <span className="text-blue-600">MindMate</span>
        </h2>

        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Mail size={20} className="text-blue-500" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-700 placeholder-gray-400"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Lock size={20} className="text-blue-500" />
            <span>Password</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-700 placeholder-gray-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Log In
        </button>

        <p className="text-center text-gray-600 mt-8 text-md">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
