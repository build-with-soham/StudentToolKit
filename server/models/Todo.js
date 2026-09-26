import mongoose from 'mongoose';

// This is a template for how EVERY tool's data (cgpa records, attendance,
// resume data, etc.) can be stored once a user is logged in. Copy this
// pattern — a userId field + the tool's own fields — for each new
// collection you add later (Cgpa, Attendance, PomodoroLog, ResumeData...).
const todoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Todo', todoSchema);
