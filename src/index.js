import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { router } from './routes/index.js'; // централният router
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Handlebars setup
app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(router);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/carShowcase')
  .then(() => {
    app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
  })
  .catch(err => console.error('DB connection error:', err.message));
