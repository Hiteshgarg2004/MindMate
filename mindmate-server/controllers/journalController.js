import Journal from "../models/Journal.js";

export const createJournalEntry = async (req, res) => {
  const { date, mood, entry, tags } = req.body;

  try {
    const newEntry = new Journal({
      user: req.user.userId,  // matches schema's 'user' field
      date,
      mood,
      entry,
      tags,
    });

    await newEntry.save();
    res.status(201).json({ message: "Journal entry saved successfully", entry: newEntry });
  } catch (error) {
    console.error("Error saving journal:", error);
    res.status(500).json({ error: "Failed to save journal entry." });
  }
};

export const getJournalEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.userId }).sort({ createdAt: -1 });  // use 'user' here
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).json({ error: "Failed to fetch journal entries." });
  }
};
// DELETE a journal entry
export const deleteJournalEntry = async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId, // Ensures users can delete only their entries
    });

    if (!deleted) {
      return res.status(404).json({ error: "Journal entry not found or unauthorized" });
    }

    res.status(200).json({ message: "Journal entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting journal:", error);
    res.status(500).json({ error: "Failed to delete journal entry." });
  }
};

// UPDATE a journal entry
export const updateJournalEntry = async (req, res) => {
  const { date, mood, entry, tags } = req.body;

  try {
    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { date, mood, entry, tags },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Entry not found or unauthorized" });
    }

    res.status(200).json({ message: "Journal entry updated", entry: updated });
  } catch (error) {
    console.error("Error updating journal:", error);
    res.status(500).json({ error: "Failed to update journal entry." });
  }
};
