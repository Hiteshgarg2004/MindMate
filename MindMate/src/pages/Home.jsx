// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// REMOVED: import Navbar from '../components/Navbar'; // Navbar is now handled by Layout.jsx

export default function Home() {
  return (
    // REMOVED: min-h-screen bg-gray-50 font-sans antialiased
    // This div now focuses ONLY on the page's content,
    // as the overall layout and Navbar are handled by Layout.jsx.
    // The 'container mx-auto px-4 py-8 md:py-12' is for content spacing within the main area.
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      {/* Adjusted min-h to be relative to the content area, not full screen */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-white text-center p-8 overflow-hidden rounded-xl shadow-lg">
        {/* Abstract shapes for background - Enhanced visibility and motion */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 right-1/2 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-6000"></div>


        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-6 animate-fade-in-up drop-shadow-lg">
            🧠 Welcome to <span className="text-blue-600">MindMate</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Your daily companion for a healthier and happier mind, offering tools to understand and nurture your well-being.
          </p>
          <Link
            to="/journal" // Or to an onboarding page
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-full shadow-xl transform transition duration-300 hover:scale-105 active:scale-95 animate-fade-in-up delay-400 text-xl tracking-wide focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white rounded-xl shadow-lg mt-12"> {/* Added margin-top for separation */}
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-16">How MindMate Helps You Thrive</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Feature Card 1: Journal */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl border-t-8 border-blue-500 flex flex-col items-center justify-between">
              <div>
                <div className="text-7xl text-blue-500 mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Reflective Journaling</h3>
                <p className="text-gray-600 text-center mb-6">
                  Express your thoughts, track your moods, and gain deeper self-awareness with private entries.
                </p>
              </div>
              <Link to="/journal" className="mt-auto text-blue-600 hover:text-blue-800 font-medium flex items-center group">
                Explore Journal
                <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            {/* Feature Card 2: Chatbot */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl border-t-8 border-teal-500 flex flex-col items-center justify-between">
              <div>
                <div className="text-7xl text-teal-500 mb-4">🤖</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Supportive Chatbot</h3>
                <p className="text-gray-600 text-center mb-6">
                  Engage in meaningful conversations and get guided support for your emotional well-being.
                </p>
              </div>
              <Link to="/chatbot" className="mt-auto text-teal-600 hover:text-teal-800 font-medium flex items-center group">
                Talk to MindMate
                <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            {/* Feature Card 3: Dashboard */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl border-t-8 border-purple-500 flex flex-col items-center justify-between">
              <div>
                <div className="text-7xl text-purple-500 mb-4">📊</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Insightful Dashboard</h3>
                <p className="text-gray-600 text-center mb-6">
                  Visualize your progress, mood patterns, and key insights over time with clear charts.
                </p>
              </div>
              <Link to="/dashboard" className="mt-auto text-purple-600 hover:text-purple-800 font-medium flex items-center group">
                View Dashboard
                <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>

            {/* Feature Card 4: Insights */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl border-t-8 border-orange-500 flex flex-col items-center justify-between">
              <div>
                <div className="text-7xl text-orange-500 mb-4">💡</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Personalized Insights</h3>
                <p className="text-gray-600 text-center mb-6">
                  Get tailored recommendations and understand your emotional landscape better.
                </p>
              </div>
              <Link to="/insights" className="mt-auto text-orange-600 hover:text-orange-800 font-medium flex items-center group">
                Discover Insights
                <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section 2 */}
      <section className="bg-blue-600 py-20 text-white text-center rounded-xl shadow-lg mt-12 mb-12"> {/* Added margin-top/bottom */}
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">Ready to Prioritize Your Mental Wellness?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join the MindMate community and take the first step towards a more balanced and aware self today. It's free to get started!
          </p>
          <Link
            to="/journal" // Or a signup/onboarding page
            className="inline-block bg-white text-blue-700 hover:bg-blue-100 font-bold py-4 px-12 rounded-full shadow-xl transform transition duration-300 hover:scale-105 active:scale-95 text-xl tracking-wide focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>

      {/* REMOVED: Footer is now handled by Layout.jsx */}
    </div>
  );
}
