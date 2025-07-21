import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  entry: {
    type: String,
    required: true,
  },
  tags: [String], // Optional
}, { timestamps: true });

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
