require('dotenv').config();
const express = require('express'), mongoose = require('mongoose'), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), cors = require('cors'), rateLimit = require('express-rate-limit'), path = require('path');
const app = express(); app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true })); app.use(express.json({ limit: '20kb' }));
const enquirySchema = new mongoose.Schema({ name: { type: String, required: true, maxlength: 100 }, email: { type: String, required: true, maxlength: 150 }, message: { type: String, required: true, maxlength: 3000 } }, { timestamps: true });
const Enquiry = mongoose.model('Enquiry', enquirySchema);
app.post('/api/enquiries', async (req, res) => { try { const { name, email, message } = req.body || {}; if (!name || !/^\S+@\S+\.\S+$/.test(email || '') || !message) return res.status(400).json({ message: 'Please provide a valid name, email and message.' }); await Enquiry.create({ name: name.trim(), email: email.trim(), message: message.trim() }); res.status(201).json({ message: 'Enquiry received' }); } catch (e) { res.status(500).json({ message: 'Could not save enquiry' }); } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
app.post('/api/admin/login', loginLimiter, async (req, res) => { const { username, password } = req.body || {}; if (username !== process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH || !await bcrypt.compare(password || '', process.env.ADMIN_PASSWORD_HASH)) return res.status(401).json({ message: 'Invalid username or password' }); const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' }); res.json({ token }); });
function adminOnly(req, res, next) { try { const token = (req.headers.authorization || '').replace(/^Bearer\s+/, ''); const p = jwt.verify(token, process.env.JWT_SECRET); if (p.role !== 'admin') throw Error(); next(); } catch (e) { res.status(401).json({ message: 'Please log in again' }); } }
app.get('/api/admin/enquiries', adminOnly, async (req, res) => { try { res.json(await Enquiry.find().sort({ createdAt: -1 }).limit(200).lean()); } catch (e) { res.status(500).json({ message: 'Unable to load enquiries' }); } });
// Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

// Serve portfolio frontend
app.use(express.static(path.join(__dirname, '..')));
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('MongoDB connected'); app.listen(port, () => console.log('API running on ' + port)); }).catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
