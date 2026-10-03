import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_FILE = path.join(__dirname, '../../session_store.json');

let sessions = {};

const session = {
  init() {
    try {
      if (fs.existsSync(SESSION_FILE)) {
        sessions = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
      }
    } catch (error) {
      console.error('Session init error:', error);
      sessions = {};
    }
  },

  create(user) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions[sessionId] = {
      user,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    this.save();
    return sessionId;
  },

  getUser(sessionId) {
    const sess = sessions[sessionId];
    if (!sess) return null;
    if (new Date(sess.expiresAt) < new Date()) {
      delete sessions[sessionId];
      this.save();
      return null;
    }
    return sess.user;
  },

  destroy(sessionId) {
    delete sessions[sessionId];
    this.save();
  },

  save() {
    try {
      fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2));
    } catch (error) {
      console.error('Session save error:', error);
    }
  }
};

session.init();
export default session;
