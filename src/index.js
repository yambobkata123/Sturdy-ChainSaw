const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

// === CONFIG ===
const PORT = 3000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/carShowcase'; // директен URI без dotenv

// === CONNECT TO MONGODB ===
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// === MIDDLEWARE ===
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// === VIEW ENGINE (HBS) ===
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// === SESSION SETUP ===
app.use(session({
  secret: 'car-showcase-secret', // може да бъде нещо произволно
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
}));

// === MAKE USER GLOBAL FOR VIEWS ===
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// === ROUTES ===
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚗 Server running at http://localhost:${PORT}`);
});
