// index.js
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import browseRoutes from './routes/browseRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const DB_URI = 'mongodb://127.0.0.1:27017/ride-showcase'; // Hardcoded URI, no dotenv for now

// Connect to MongoDB
mongoose.connect(DB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Setup Handlebars view engine
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
}));
app.set('view engine', 'hbs'); app.set('views', path.join(__dirname, 'views')); // Static resources (CSS, images, etc.) 
app.use('/views', express.static(path.join(__dirname, 'views')));
// Middleware

// Serve static files from /public (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Setup session with MongoDB store
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DB_URI }),
}));

// Make session user available to all views as 'user'
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/browse', browseRoutes);
app.use('/cars', carRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
