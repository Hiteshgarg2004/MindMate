import React, { useEffect, useState } from 'react';
import API from '../api/axios'; // Make sure this is your axios instance with credentials enabled
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For navigation after logout

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To show loading spinner
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth');
        setUser(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // Assuming your backend has a logout endpoint, e.g., POST /api/auth/logout
      await API.post('/auth/logout');
      // Clear user data and redirect to login page
      setUser(null);
      navigate('/login'); // Redirect to your login page
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails on the backend, clear client-side state
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Your Profile</h2>
      <div className="text-gray-700 text-lg space-y-4">
        <div>
          <span className="font-medium">User ID:</span> {user._id}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>

        {/* Display creation date if available */}
        {user.createdAt && (
          <div>
            <span className="font-medium">Account Created:</span> {new Date(user.createdAt).toLocaleDateString()}
          </div>
        )}

        <div className="pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-200 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}