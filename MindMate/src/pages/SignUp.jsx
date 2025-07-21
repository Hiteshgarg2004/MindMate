import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// REMOVED: import Navbar from "../components/Navbar"; // Navbar is now handled by Layout.jsx
import API from "../api/axios"; // axios instance with withCredentials: true
import { Mail, Lock } from 'lucide-react'; // Importing Lucide icons

export default function SignUp() {
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
      showCustomModal("Please enter both email and password.", "error");
      return;
    }

    if (password.length < 6) {
      showCustomModal("Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      const res = await API.post("/auth/signup", { email, password });
      console.log("✅ Signup successful:", res.data);

      showCustomModal("Signup successful!", "success");

      setTimeout(() => {
        setShowModal(false);
        navigate("/"); // Navigate to home or login page after successful signup
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Full Axios error response:", err.response);

      showCustomModal(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed. Please try again.",
        "error"
      );
    }
  };

  return (
    // This div is the root of SignUp's content. It relies on Layout for overall page styling.
    // The Layout component already provides min-h-screen, bg-gray-50, font-sans, antialiased, and flex-col.
    // It also handles the padding-top for the Navbar.
    <div className="flex-1 flex items-center justify-center p-4 py-8 md:py-12">
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

      {/* Main content for the signup form */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md border-t-8 border-blue-500 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-800 text-center leading-tight">
          Create Your <span className="text-blue-600">MindMate</span> Account
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
            placeholder="Minimum 6 characters"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full font-semibold text-lg shadow-md transform transition duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Create Account
        </button>

        <p className="text-center text-gray-600 mt-8 text-md">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
