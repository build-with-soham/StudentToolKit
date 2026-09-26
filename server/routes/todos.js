import express from 'express';
import Todo from '../models/Todo.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Every route below requires a logged-in user, and every query is scoped
// to req.userId — so one user can never see or edit another user's data.
router.use(requireAuth);

// GET /api/todos — list this user's todos
router.get('/', async (req, res) => {
  const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ todos });
});

// POST /api/todos — create one
router.post('/', async (req, res) => {
  const { text, dueDate } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required.' });

  const todo = await Todo.create({ userId: req.userId, text: text.trim(), dueDate: dueDate || null });
  res.status(201).json({ todo });
});

// PATCH /api/todos/:id — toggle done / edit text or due date
router.patch('/:id', async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ error: 'Todo not found.' });

  const { text, done, dueDate } = req.body;
  if (text !== undefined) todo.text = text;
  if (done !== undefined) todo.done = done;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  await todo.save();

  res.json({ todo });
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const result = await Todo.deleteOne({ _id: req.params.id, userId: req.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Todo not found.' });
  res.json({ ok: true });
});

export default router;
