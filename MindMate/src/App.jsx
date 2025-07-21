// src/App.jsx
// This is your main application file. It sets up routing and uses the Layout component
// to provide a consistent structure across all pages.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // ✨ Import your Layout component

// Import all your page components
// Ensure these paths are correct relative to App.jsx
import Home from './pages/Home';
import Journal from './pages/Journal';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import EditJournal from "./pages/EditJournal";
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Profile from './pages/Profile';

// Add any other page imports here (e.g., Profile, Privacy, Terms)

function App() {
  // IMPORTANT: The Navbar component (which is inside Layout.jsx) now manages its own
  // authentication state (isLoggedIn) and logout logic internally by making API calls.
  // So, you typically don't need to pass isLoggedIn or handleLogout
  // from App.jsx to Layout/Navbar anymore, unless you have other parts of your
  // app that *also* need to know the login status globally.

  return (
    <Router>
      {/*
        🚀 CRITICAL CORRECTION:
        The <Routes> component MUST be wrapped by the <Layout> component.
        This ensures that:
        1. The Navbar (rendered inside Layout) is present on ALL pages.
        2. The Layout component's dynamic padding-top correctly pushes content
           below the fixed Navbar, preventing overlap.
        3. Global styling (like background, font) from Layout is applied consistently.
      */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms/>} />
          <Route path="/profile" element={<Profile/>} />

          <Route path="/edit/:id" element={<EditJournal />} />

          {/* Add other routes here */}
          {/* Example: <Route path="/profile" element={<ProfilePage />} /> */}
          {/* Example: <Route path="/privacy" element={<PrivacyPage />} /> */}
          {/* Example: <Route path="/terms" element={<TermsPage />} /> */}
          {/* Example: <Route path="/contact" element={<ContactPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
