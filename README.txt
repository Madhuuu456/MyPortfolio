B MADHU — UPDATED DEVELOPER PORTFOLIO
====================================

WHAT'S INCLUDED
- Responsive portfolio with your supplied profile photo.
- About, skills, projects, education and contact sections.
- Four working Live Demo links supplied by you.
- Admin login page (admin-login.html).
- Optional Express + MongoDB backend to store enquiries and authenticate the admin.
- No certifications are listed, as you said you do not have any yet.

QUICK VIEW (STATIC VERSION)
1. Extract this ZIP.
2. Open index.html in your browser.
3. The project cards open your four live GitHub Pages websites.
4. Contact form opens an email draft addressed to madhuyadav60082@gmail.com.
5. Admin login page is included, but real login needs the backend steps below.

RUN WITH DATABASE + REAL ADMIN LOGIN
Requirements: Node.js and a MongoDB database (MongoDB Atlas or local MongoDB).
1. Open a terminal in the backend folder.
2. Run: npm install
3. Copy .env.example to a file named .env.
4. Create a MongoDB database and paste its connection string into MONGODB_URI.
5. Generate a password hash:
   node -e "console.log(require('bcryptjs').hashSync('ChooseYourStrongPassword',12))"
   Paste the output into ADMIN_PASSWORD_HASH.
6. Set ADMIN_USERNAME and replace JWT_SECRET with a long random secret.
7. For local use, keep FRONTEND_ORIGIN=http://localhost:3000.
8. Run: npm start
9. Open http://localhost:3000
   Admin page: http://localhost:3000/admin-login.html

DEPLOYMENT NOTES
- GitHub Pages hosts static HTML/CSS/JS only. It cannot run Express or connect directly to MongoDB.
- To use real admin login and save enquiries, deploy the backend folder to a Node.js host and configure MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET and FRONTEND_ORIGIN there.
- In api-config.js, set window.PORTFOLIO_API_URL to your deployed backend origin (for example https://your-api-host.example).
- Set FRONTEND_ORIGIN on the backend to your exact GitHub Pages origin: https://madhuuu456.github.io
- Use HTTPS. Never commit backend/.env or share your password, JWT secret, or MongoDB connection string.
- If backend is not configured, the contact form falls back to opening an email draft. The login page will not authenticate until the backend is running.

FILES
index.html, styles.css, script.js       Main portfolio
madhu-profile.jpeg                      Your supplied profile photo
admin-login.html, admin.js              Admin login and enquiry inbox UI
api-config.js                           Backend URL setting
backend/server.js                       Express API, JWT auth and MongoDB
backend/.env.example                    Environment variable template
