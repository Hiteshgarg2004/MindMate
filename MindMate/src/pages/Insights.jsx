import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from '../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { format } from "date-fns";

// Subcomponents
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans antialiased">
    <div className="flex flex-col items-center p-10 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-2xl text-blue-600 font-semibold">
        Fetching your journal data... 📊
      </p>
    </div>
  </div>
);

const EmptyState = () => (
  <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 border-t-4 border-blue-500 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
    <span className="text-6xl mb-6" role="img" aria-label="no-data">🚫</span>
    <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
      No Journal Entries Found
    </p>
    <p className="text-lg text-gray-500 leading-relaxed max-w-prose">
      Add some journal entries on the “Journal” page to unlock personalized insights!
    </p>
  </section>
);

const ChartCard = ({ title, children, color = "blue" }) => {
  const bg = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700"
  }[color];
  return (
    <div className={`mb-8 p-4 border rounded-lg shadow-sm ${bg}`}>
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      {children}
    </div>
  );
};

const SuggestionsList = ({ suggestions }) => (
  <ul className="list-disc list-inside ml-4 space-y-2">
    {suggestions.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ul>
);

export default function Insights() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [insightsData, setInsightsData] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchJournals = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await API.get("/journal");
      setJournals(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load journal entries. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJournals(); }, []);

  const generateInsights = () => {
    if (journals.length === 0) {
      setMessage({ type: "error", text: "No journal entries to analyze." });
      return;
    }

    setGeneratingInsights(true);
    setMessage({ type: "", text: "" });
    setInsightsData(null);

    try {
      const moodCounts = {};
      const tagCounts = {};
      const moodTimeline = [];

      journals.forEach(entry => {
        const mood = entry.mood?.toLowerCase() || "unspecified";
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;

        moodTimeline.push({
          date: format(new Date(entry.date), 'MMM dd, yyyy'),
          mood: entry.mood || "Unspecified"
        });

        (entry.tags || []).forEach(tag => {
          const t = tag.toLowerCase();
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });

      const moodChartData = Object.entries(moodCounts).map(([name, count]) => ({ name, count }));
      const tagChartData = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
      const mostFrequentMood = moodChartData.sort((a, b) => b.count - a.count)[0]?.name || "N/A";

      const suggestions = [];
      if (["sad", "distressed"].includes(mostFrequentMood)) {
        suggestions.push("Try journaling about gratitude or uplifting moments.");
      } else if (["excited", "content"].includes(mostFrequentMood)) {
        suggestions.push("You're in a good place—keep doing what works for you!");
      } else {
        suggestions.push("Reflect on what might be influencing a neutral or unclear mood.");
      }

      if (tagChartData.some(tag => tag.name === "work")) {
        suggestions.push("Balance work reflections with personal or fun topics.");
      }
      if (tagChartData.some(tag => tag.name === "family")) {
        suggestions.push("Explore family dynamics more deeply in your writing.");
      }
      if (journals.length < 5) {
        suggestions.push("More entries will help uncover deeper patterns.");
      } else if (journals.length >= 10) {
        suggestions.push("You’ve built a great journaling habit—keep it up!");
      }

      setInsightsData({ moodChartData, tagChartData, moodTimeline, mostFrequentMood, suggestions });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to generate insights." });
    } finally {
      setGeneratingInsights(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans antialiased">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">Your Journal Insights</h1>

        {message.text && (
          <div className={`px-6 py-3 rounded-lg text-center mx-auto max-w-md mb-8 shadow-md
            ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
            {message.text}
          </div>
        )}

        {journals.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 border-t-4 border-blue-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">Generate Your Personalized Insights</h2>
            <p className="text-center text-gray-600 mb-6">
              Analyze your entries to discover trends, themes, and tips for better self-awareness.
            </p>
            <div className="flex justify-center mb-8">
              <button
                onClick={generateInsights}
                disabled={generatingInsights}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {generatingInsights ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Generating...
                  </>
                ) : (
                  <>✨ Generate Insights</>
                )}
              </button>
            </div>

            {insightsData && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>

                <ChartCard title="Mood Frequency" color="blue">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insightsData.moodChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#4299e1" name="Entries" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {insightsData.tagChartData.length > 0 && (
                  <ChartCard title="Top Tags" color="purple">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={insightsData.tagChartData}
                          cx="50%" cy="50%"
                          outerRadius={100}
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          dataKey="value"
                          nameKey="name"
                        >
                          {insightsData.tagChartData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                <div className="prose max-w-none text-gray-700 mt-8">
                  <p><strong>📈 Most Frequent Mood:</strong> <span className="capitalize">{insightsData.mostFrequentMood}</span></p>
                  <p><strong>🏷️ Top Tags:</strong> {insightsData.tagChartData.length ? insightsData.tagChartData.map(t => t.name).join(', ') : "None"}</p>
                  <p><strong>💡 Suggestions:</strong></p>
                  <SuggestionsList suggestions={insightsData.suggestions} />
                  <p className="mt-4"><strong>🕒 Mood Over Time:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                    {insightsData.moodTimeline.map((item, index) => (
                      <li key={index}>{item.date}: <span className="capitalize">{item.mood}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MindMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
