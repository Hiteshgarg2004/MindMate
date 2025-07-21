import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// REMOVED: import Navbar from '../components/Navbar'; // Navbar is now handled by Layout.jsx
import API from "../api/axios";
import { format } from "date-fns"; // Import format for date input max attribute
import { Calendar, Lightbulb, Tag, Save, XCircle } from 'lucide-react'; // Import Lucide icons

export default function EditJournal() {
  const { state } = useLocation(); // this holds the entry passed from Dashboard
  const navigate = useNavigate();

  // Redirect if no state (i.e., accessed directly without an entry)
  useEffect(() => {
    if (!state || !state._id) {
      navigate('/dashboard'); // Redirect to dashboard if no entry data
    }
  }, [state, navigate]);

  const [formData, setFormData] = useState({
    date: state?.date ? format(new Date(state.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), // Format date for input
    mood: state?.mood || "",
    entry: state?.entry || "",
    tags: state?.tags?.join(", ") || "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const moods = [
    { emoji: '😄', label: 'Excited' },
    { emoji: '🙂', label: 'Content' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😢', label: 'Distressed' },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Clear messages before submit

    if (!formData.mood || !formData.entry.trim() || !formData.date) {
      setMessage({ type: "error", text: "Please select a mood, write an entry, and select a date." });
      return;
    }

    const updatedData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      await API.put(`/journal/${state._id}`, updatedData);
      setMessage({ type: "success", text: "Entry updated successfully!" });
      setTimeout(() => navigate("/dashboard"), 1500); // redirect after success
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to update the entry. Please try again." });
    }
  };

  // If state is not available, show a loading/redirecting message
  if (!state || !state._id) {
    return (
      // This div is now positioned correctly by Layout.jsx
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-var(--navbar-height,72px))]">
        <div className="flex flex-col items-center p-10 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
          <p className="text-2xl text-blue-600 font-semibold">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    // This div is the root of EditJournal's content. It relies on Layout for overall page styling.
    // The Layout component already provides min-h-screen, bg-gray-50, font-sans, antialiased.
    // It also handles the padding-top for the Navbar and the global footer.
    <div className="container mx-auto px-4 py-8 md:py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10 tracking-tight">
        Edit Your <span className="text-blue-600">Journal</span> Entry
      </h1>

      <section className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-8 border-blue-500 max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 flex items-center space-x-3">
          <Lightbulb size={30} className="text-blue-500" />
          <span>Modify Your Entry</span>
        </h2>

        {message.text && (
          <div
            className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-center shadow-xl z-50 animate-fade-in-down
            ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div>
              <label htmlFor="entryDate" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center space-x-2">
                <Calendar size={20} className="text-gray-600" />
                <span>Select Date:</span>
              </label>
              <input
                type="date"
                id="entryDate"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-700"
                max={format(new Date(), 'yyyy-MM-dd')} // Limit to current date for consistency
                required
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-gray-700 text-lg font-semibold mb-3">
                How do you feel today?
              </label>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.emoji}
                    type="button" // Important: prevent form submission
                    onClick={() => setFormData(prev => ({ ...prev, mood: moodOption.label }))} // Save label, not emoji
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300
                      ${formData.mood === moodOption.label // Compare with label
                        ? `border-blue-500 bg-blue-50 shadow-md`
                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-100'}`}
                  >
                    <span className="text-4xl md:text-5xl">{moodOption.emoji}</span>
                    <span className="text-sm font-medium text-gray-600 mt-1">{moodOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Journal Textarea */}
          <div>
            <label htmlFor="journalText" className="block text-gray-700 text-lg font-semibold mb-2">
              Write your thoughts:
            </label>
            <textarea
              id="journalText"
              name="entry"
              value={formData.entry}
              onChange={handleChange}
              rows="8"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 resize-y text-gray-700 placeholder-gray-400"
              placeholder="What's on your mind today? How was your day? Dive deep into your feelings..."
              required
            ></textarea>
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tagsInput" className="block text-gray-700 text-lg font-semibold mb-2 flex items-center space-x-2">
              <Tag size={20} className="text-gray-600" />
              <span>Tags (comma separated):</span>
            </label>
            <input
              type="text"
              id="tagsInput"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., happy, work, family, stress, gratitude"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center md:justify-end gap-4 mt-8">
            <button
              type="button" // Use type="button" to prevent form submission
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-200 flex items-center space-x-2"
            >
              <XCircle size={20} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
