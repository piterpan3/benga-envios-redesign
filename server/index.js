import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { querystring } from './lib/utils.js';
import database from './lib/database.js';
import session from './lib/session.js';
import auth from './routes/auth.js';
import api from './routes/api.js';
import pages from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Initialize database
database.init();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Session management
  let cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(c => {
      const [name, value] = c.trim().split('=');
      cookies[name] = decodeURIComponent(value || '');
    });
  }

  const sessionId = cookies.sessionId;
  const user = sessionId ? session.getUser(sessionId) : null;

  req.session = { id: sessionId, user };
  req.url = url;
  req.query = Object.fromEntries(url.searchParams);
  req.cookies = cookies;

  // Helper to set session cookie
  res.setSession = (sessionId) => {
    res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
  };

  // Helper to send JSON
  res.json = (data, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Helper to send HTML
  res.html = (html, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  };

  // Helper to redirect
  res.redirect = (location, status = 302) => {
    res.writeHead(status, { 'Location': location });
    res.end();
  };

  // Helper to parse body
  req.parseBody = () => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          resolve(querystring.parse(body));
        } catch {
          resolve({});
        }
      });
    });
  };

  // Routes
  try {
    // Static files
    if (pathname.startsWith('/public/')) {
      const filePath = path.join(__dirname, '..', pathname);
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(content);
        return;
      }
    }

    // API routes
    if (pathname.startsWith('/api/')) {
      await api(req, res);
      return;
    }

    // Auth routes
    if (pathname.startsWith('/auth/')) {
      await auth(req, res);
      return;
    }

    // Page routes
    await pages(req, res);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Internal server error' }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`BENGA ENVIOS server running at http://localhost:${PORT}`);
});
