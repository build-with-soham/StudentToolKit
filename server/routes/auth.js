import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
// Body: { credential: "<the ID token string from Google's Sign-In button>" }
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential.' });
  }

  try {
    // 1. Verify the token was really issued by Google, for OUR app, and
    //    hasn't been tampered with. This is the step that makes Google
    //    login secure — we never see or trust anything the client claims
    //    about itself without this check.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 2. Find or create the matching user in MongoDB.
   let user = await User.findOne({
  $or: [
    { googleId: googleId },
    { email: email.toLowerCase() }
  ]
    });
    if (!user) {
      user = await User.create({ googleId, email, name, avatar: picture || '' });
    } else {
      // Keep name/avatar fresh in case they changed their Google profile.
      user.name = name;
      user.avatar = picture || user.avatar;
      await user.save();
    }

    // 3. Issue OUR OWN session token (not Google's). The frontend stores
    //    this and sends it back on every future request as proof of login.
    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error('Google login failed:', err.message);
    res.status(401).json({ error: 'Google sign-in verification failed.' });
  }
});

// GET /api/auth/me — used on page load to check "am I still logged in?"
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('-googleId -__v');
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

export default router;
