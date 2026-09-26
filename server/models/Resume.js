import mongoose from 'mongoose';

// A resume is naturally "one document per user" (not a list like todos),
// so we store the whole form as nested fields on a single record.
const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    link: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: { type: String, default: '' },
    certs: { type: String, default: '' },
    edu: { type: [[String]], default: [] },
    proj: { type: [[String]], default: [] },
    exp: { type: [[String]], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
