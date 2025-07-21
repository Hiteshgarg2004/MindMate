import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { format } from "date-fns";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const navigate = useNavigate();

  const fetchJournals = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await API.get("/journal");
      setJournals(res.data);
      setMessage({ type: "success", text: "Journal entries loaded successfully!" });
    } catch (err) {
      console.error("Error fetching journal entries:", err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to load journal entries. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleEdit = (entry) => {
    navigate(`/edit/${entry._id}`, { state: entry });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await API.delete(`/journal/${id}`);
      setJournals(prev => prev.filter(j => j._id !== id));
      setMessage({ type: "success", text: "Entry deleted successfully." });
    } catch (err) {
      console.error("Error deleting entry:", err);
      setMessage({ type: "error", text: "Failed to delete journal entry." });
    }
  };

  const toggleExpand = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  const getMoodEmoji = (mood) => {
    switch (mood?.toLowerCase()) {
      case "excited":
        return "😄";
      case "content":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      case "distressed":
        return "😢";
      default:
        return "💭";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans antialiased">
        <div className="flex flex-col items-center p-10 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-2xl text-blue-600 font-semibold">
            Loading your journal entries... 🧘‍♀️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          Your Journal Dashboard
        </h1>

        {message.type === "error" && (
          <div className="px-6 py-3 rounded-lg text-center mx-auto max-w-md mb-8 shadow-md bg-red-100 text-red-700 border border-red-300" role="alert">
            {message.text}
          </div>
        )}

        {journals.length === 0 ? (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 border-t-4 border-blue-500 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <span className="text-6xl mb-6" role="img" aria-label="empty-state">📖</span>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Your Journal Awaits!
            </p>
            <p className="text-lg text-gray-500 leading-relaxed max-w-prose">
              It looks like you haven't penned down any thoughts yet. This is your canvas to explore, reflect, and grow. Start your journaling journey today!
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {journals.map((entry) => (
              <div
                key={entry._id}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100 flex items-center">
                    <span className="mr-2 text-blue-500">📅</span>
                    {format(new Date(entry.date), "MMM dd, yyyy 'at' hh:mm a")}
                  </div>
                  <div className="text-xl font-bold text-blue-600 mb-3 capitalize flex items-center">
                    {getMoodEmoji(entry.mood)}{" "}
                    <span className="ml-2">{entry.mood || "No Mood Captured"}</span>
                  </div>
                  <p
                    className={`mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed text-base ${
                      expandedEntryId === entry._id ? "" : "max-h-32 overflow-hidden text-ellipsis"
                    }`}
                  >
                    {entry.entry}
                  </p>
                  {entry.entry.length > 150 && (
                    <button
                      onClick={() => toggleExpand(entry._id)}
                      className="text-blue-600 hover:underline text-sm mt-3 font-semibold focus:outline-none"
                    >
                      {expandedEntryId === entry._id ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>

                {entry.tags?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {entry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit/Delete Buttons */}
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-yellow-500 hover:text-yellow-600 font-medium text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MindMate. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom spin animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
