// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios'; // ✅ Use axios instance with baseURL & credentials
import { Menu, X, UserCircle, LogIn, UserPlus, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Check auth status using deployed backend URL (via axios instance)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await API.get("/auth/me"); // ✅ Your backend route to check auth
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout"); // ✅ Uses axios instance
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Sign Out failed:", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Insights", path: "/insights" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${isScrolled ? 'bg-blue-700 shadow-xl' : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-md'}`}>
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-blue-100">
          <span className="text-3xl">🧠</span>
          <span>MindMate</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative py-1 text-white transition-all duration-300 ${
                location.pathname === link.path
                  ? 'font-bold text-blue-100 after:w-full after:bg-blue-100'
                  : 'hover:text-blue-200 after:w-0 hover:after:w-full'
              } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ease-out`}
            >
              {link.name}
            </Link>
          ))}

          <div className="relative group ml-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md">
              <UserCircle size={20} />
              <span>Account</span>
              <svg className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white text-gray-800 mt-2 rounded-lg shadow-xl py-2 min-w-[160px] z-20 ring-1 ring-black ring-opacity-5">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100">
                    <Settings size={18} className="text-gray-600" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={18} className="text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100">
                    <LogIn size={18} className="text-blue-600" />
                    <span>Sign In</span>
                  </Link>
                  <Link to="/signup" className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100">
                    <UserPlus size={18} className="text-purple-600" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hamburger */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white focus:outline-none">
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0'
      } bg-blue-700`}>
        <div className="flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block w-full text-center px-4 py-3 text-lg font-medium ${
                location.pathname === link.path ? 'bg-blue-600 text-blue-100' : 'text-white hover:bg-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-blue-500 w-full my-2" />
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg text-white hover:bg-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings size={20} />
                <span>Profile Settings</span>
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg bg-red-500 hover:bg-red-600 text-white">
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg text-white hover:bg-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
              <Link to="/signup" className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg text-white hover:bg-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
