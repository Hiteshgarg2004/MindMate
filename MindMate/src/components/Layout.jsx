// src/components/Layout.jsx
// This component provides a consistent layout for all your pages,
// including the Navbar and proper spacing to prevent overlap.

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal links
import Navbar from './Navbar'; // Ensure this path is correct for your Navbar component

export default function Layout({ children }) {
  const navbarRef = useRef(null); // Ref to measure the Navbar's actual height
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    // Function to measure and set Navbar height
    const measureNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        setNavbarHeight(height);
        // Set a CSS custom property on the document root (<html> tag)
        // This makes the Navbar's height available globally for CSS
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    // Measure initially when the component mounts
    measureNavbarHeight();

    // Re-measure on window resize events
    window.addEventListener('resize', measureNavbarHeight);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', measureNavbarHeight);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      {/* Navbar container */}
      <div ref={navbarRef}>
        <Navbar />
      </div>

      {/* Main content with dynamic padding based on navbar height */}
      <main
        style={{ paddingTop: `var(--navbar-height, 72px)` }}
        className="flex-1"
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MindMate. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:underline hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <a
              href="mailto:support@mindmate.com"
              className="hover:underline hover:text-white transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
