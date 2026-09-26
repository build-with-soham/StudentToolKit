import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    // Room to grow: college, branch, semester — used later to personalize
    // the AI roadmap chatbot and other tools.
    profile: {
      college: { type: String, default: '' },
      branch: { type: String, default: '' },
      semester: { type: Number, default: null },
      skills: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
