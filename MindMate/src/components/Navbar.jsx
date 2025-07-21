// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is used for API calls
import { Menu, X, UserCircle, LogIn, UserPlus, LogOut, Settings } from 'lucide-react'; // Importing icons

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // For desktop dropdown, we'll primarily use Tailwind's group-hover for simplicity as per your last input.
  // For mobile, we'll still use state for the hamburger menu.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state
  const [isScrolled, setIsScrolled] = useState(false); // State for Navbar shadow on scroll
  const location = useLocation(); // Hook to get current path for active link styling
  const navigate = useNavigate(); // Hook for navigation after logout

  // Effect to handle Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Assuming your backend has an endpoint to check auth status
        await axios.get("http://localhost:5000/api/auth", {
          withCredentials: true, // Important for sending cookies/session
        });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        // console.error("Not logged in or session expired:", error); // For debugging
      }
    };
    checkLoginStatus();
  }, [location.pathname]); // Re-check login status when route changes

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {}, // Empty body for POST request
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      navigate('/login'); // Redirect to login page after logout (using /login as per your routes)
    } catch (error) {
      console.error('Sign Out failed:', error);
      // Optionally show an error message to the user
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
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-blue-100 transition-colors duration-300">
          <span className="text-3xl">🧠</span>
          <span>MindMate</span>
        </Link>

        {/* Desktop Navigation Links and User Account Menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative py-1 text-white transition-all duration-300
                ${location.pathname === link.path
                  ? 'font-bold text-blue-100 after:w-full after:bg-blue-100'
                  : 'hover:text-blue-200 after:w-0 hover:after:w-full'
                }
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ease-out`}
            >
              {link.name}
            </Link>
          ))}

          {/* Desktop Account Dropdown Menu (using group-hover) */}
          <div className="relative group ml-4"> {/* Added ml-4 for spacing */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <UserCircle size={20} />
              <span>Account</span>
              <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute right-0 hidden group-hover:block bg-white text-gray-800 mt-2 rounded-lg shadow-xl py-2 min-w-[160px] ring-1 ring-black ring-opacity-5 z-20 origin-top-right animate-fade-in-down">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Settings size={18} className="text-gray-600" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-red-600"
                  >
                    <LogOut size={18} className="text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <LogIn size={18} className="text-blue-600" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <UserPlus size={18} className="text-purple-600" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu (Conditional rendering with smooth transition) */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0'
        } bg-blue-700`}
      >
        <div className="flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block w-full text-center px-4 py-3 text-lg font-medium transition-colors duration-300
                          ${location.pathname === link.path ? 'bg-blue-600 text-blue-100' : 'text-white hover:bg-blue-600'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Account Options - Integrated directly for simplicity on mobile */}
          <div className="border-t border-blue-500 w-full my-2"></div> {/* Separator */}
          {isLoggedIn ? (
             <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg font-medium text-white hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings size={20} />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
             </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg font-medium text-white hover:bg-blue-600 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-lg font-medium text-white hover:bg-blue-600 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
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
