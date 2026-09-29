/**
 * Vercel serverless entry — re-exports the Express app.
 * Local: npm start (backend/server.js). Vercel: routes via vercel.json.
 */
module.exports = require('../backend/server');
