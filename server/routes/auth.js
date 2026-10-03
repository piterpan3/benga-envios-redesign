import database from '../lib/database.js';
import session from '../lib/session.js';
import { hash, validateEmail, escapeHtml } from '../lib/utils.js';

const auth = async (req, res) => {
  const pathname = req.url.pathname;
  const method = req.method;
  const db = database.get();

  // POST /auth/register
  if (pathname === '/auth/register' && method === 'POST') {
    const body = await req.parseBody();
    const { name, email, password, passwordConfirm, phone } = body;

    if (!name || !email || !password || !passwordConfirm || !phone) {
      return res.json({ error: 'Todos os campos são obrigatórios' }, 400);
    }

    if (!validateEmail(email)) {
      return res.json({ error: 'Email inválido' }, 400);
    }

    if (password !== passwordConfirm) {
      return res.json({ error: 'As palavras-passe não coincidem' }, 400);
    }

    if (password.length < 6) {
      return res.json({ error: 'A palavra-passe deve ter no mínimo 6 caracteres' }, 400);
    }

    const userExists = db.users.find(u => u.email === email);
    if (userExists) {
      return res.json({ error: 'Este email já está registado' }, 400);
    }

    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: escapeHtml(name),
      email: email.toLowerCase(),
      phone: escapeHtml(phone),
      passwordHash: hash.password(password),
      role: 'customer',
      active: true,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    database.save();
    database.addAuditLog('user_register', newUser.id, { email });

    const sessionId = session.create({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });
    res.setSession(sessionId);
    res.json({ success: true, message: 'Conta criada com sucesso' });
  }

  // POST /auth/login
  else if (pathname === '/auth/login' && method === 'POST') {
    const body = await req.parseBody();
    const { email, password } = body;

    if (!email || !password) {
      return res.json({ error: 'Email e palavra-passe são obrigatórios' }, 400);
    }

    const user = db.users.find(u => u.email === email.toLowerCase());
    if (!user || !hash.compare(password, user.passwordHash)) {
      return res.json({ error: 'Email ou palavra-passe incorretos' }, 400);
    }

    if (!user.active) {
      return res.json({ error: 'Conta bloqueada' }, 400);
    }

    const sessionId = session.create({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.setSession(sessionId);
    database.addAuditLog('user_login', user.id, {});
    res.json({ success: true, message: 'Login realizado com sucesso' });
  }

  // POST /auth/logout
  else if (pathname === '/auth/logout' && method === 'POST') {
    if (req.session.id) {
      session.destroy(req.session.id);
      database.addAuditLog('user_logout', req.session.user?.id, {});
    }
    res.setHeader('Set-Cookie', 'sessionId=; HttpOnly; Path=/; Max-Age=0');
    res.json({ success: true, message: 'Logout realizado com sucesso' });
  }

  else {
    res.json({ error: 'Rota não encontrada' }, 404);
  }
};

export default auth;
