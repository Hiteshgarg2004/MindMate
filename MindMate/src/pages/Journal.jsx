import React, { useState } from 'react';
import API from "../api/axios";
import { format } from 'date-fns';
import { Lightbulb, Calendar, Tag } from 'lucide-react';

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [tags, setTags] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  const moods = [
    { emoji: '😄', label: 'Excited' },
    { emoji: '🙂', label: 'Content' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😢', label: 'Distressed' },
  ];

  const showCustomMessage = (type, text) => {
    setMessageText(text);
    if (type === 'success') {
      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
        setMessageText('');
      }, 3000);
    } else if (type === 'error') {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
        setMessageText('');
      }, 5000);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood || !journalEntry.trim() || !selectedDate) {
      showCustomMessage('error', 'All fields (mood, entry, date) are required.');
      return;
    }

    const journalData = {
      date: selectedDate,
      mood: selectedMood,
      entry: journalEntry.trim(),
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };

    try {
      const res = await API.post("/journal", journalData);
      console.log("✅ Saved to backend:", res.data);
      showCustomMessage('success', "Journal entry saved successfully!");

      setSelectedMood("");
      setJournalEntry("");
      setTags("");
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    } catch (err) {
      console.error("❌ Error saving journal:", err.response?.data || err.message);
      showCustomMessage('error', "Failed to save journal. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
      {/* Success Message */}
      {showSaveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-500 ease-in-out">
          {messageText}
        </div>
      )}
      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-500 ease-in-out">
          {messageText}
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10 tracking-tight">
        Your Daily <span className="text-blue-600">Journal</span>
      </h1>

      <section className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-8 border-blue-500 hover:shadow-2xl transition duration-300">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 flex items-center space-x-3">
          <Lightbulb size={30} className="text-blue-500" />
          <span>New Reflective Entry</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Date Picker */}
          <div>
            <label htmlFor="entryDate" className=" text-gray-700 text-lg font-semibold mb-2 flex items-center space-x-2">
              <Calendar size={20} className="text-gray-600" />
              <span>Select Date:</span>
            </label>
            <input
              type="date"
              id="entryDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 text-gray-700"
              max={format(new Date(), 'yyyy-MM-dd')}
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
                  onClick={() => setSelectedMood(moodOption.emoji)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none
                    ${selectedMood === moodOption.emoji
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-100'}`}
                >
                  <span className="text-4xl md:text-5xl">{moodOption.emoji}</span>
                  <span className="text-sm font-medium text-gray-600 mt-1">{moodOption.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Journal Entry */}
        <div className="mb-8">
          <label htmlFor="journalText" className="block text-gray-700 text-lg font-semibold mb-2">
            Write your thoughts:
          </label>
          <textarea
            id="journalText"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            rows="10"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 transition duration-200 resize-y text-gray-700 placeholder-gray-400"
            placeholder="What's on your mind today? How was your day? Dive deep into your feelings..."
          />
        </div>

        {/* Tags Input */}
        <div className="mb-8">
          <label htmlFor="tags" className=" text-gray-700 text-lg font-semibold mb-2 flex items-center space-x-2">
            <Tag size={20} className="text-gray-600" />
            <span>Add Tags (comma separated):</span>
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. gratitude, stress, work"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 text-gray-700"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-0 text-lg"
          >
            Save Journal Entry
          </button>
        </div>
      </section>
    </div>
  );
}
