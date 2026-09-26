import express from 'express';
import Resume from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

// GET /api/resume — return this user's saved resume, or null if none yet
router.get('/', async (req, res) => {
  const resume = await Resume.findOne({ userId: req.userId });
  res.json({ resume: resume || null });
});

// PUT /api/resume — create or overwrite this user's resume (upsert)
// Frontend sends the whole form object every time it autosaves, so we
// just replace the fields — simpler than diffing partial updates.
router.put('/', async (req, res) => {
  const { name, email, phone, location, link, summary, skills, certs, edu, proj, exp } = req.body;

  const resume = await Resume.findOneAndUpdate(
    { userId: req.userId },
    { name, email, phone, location, link, summary, skills, certs, edu, proj, exp },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({ resume });
});

export default router;
