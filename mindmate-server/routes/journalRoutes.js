import express from "express";
import {
  createJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  updateJournalEntry
} from "../controllers/JournalController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(auth);

router.post("/", createJournalEntry);
router.get("/", getJournalEntries);
router.delete("/:id", deleteJournalEntry);
router.put("/:id", updateJournalEntry);

export default router;
