require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
require('express-async-errors'); 
const logger = require('./middlewares/logger')

// Import DB connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mediaRoutes = require('./routes/media.routes');

// Import error middleware
const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Initialize Express
const app = express();

// ---------- MIDDLEWARES ----------

// Security headers
app.use(helmet());

// Enable CORS with cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());
app.use(logger);

// ---------- ROUTES ----------

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'StreamForge API running ✅' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/users', userRoutes);

//Media routes
app.use('/media', mediaRoutes);

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// ---------- START SERVER ----------

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
    process.exit(1);
  });
