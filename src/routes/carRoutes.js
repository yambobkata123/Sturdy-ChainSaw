// routes/carRoutes.js
import express from 'express';
const router = express.Router();

// Middleware to check if user is logged in (basic example)
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// GET /cars - show all cars
router.get('/', async (req, res) => {
  // Fetch car posts from DB (placeholder)
  res.render('browse', { cars: [] });
});

// GET /cars/create - show create form
router.get('/create', isAuthenticated, (req, res) => {
  res.render('create');
});

// POST /cars/create - handle form submission
router.post('/create', isAuthenticated, async (req, res) => {
  // Save car post to DB (placeholder)
  res.redirect('/cars');
});

// GET /cars/:id - show details
router.get('/:id', async (req, res) => {
  // Fetch one car by ID from DB (placeholder)
  res.render('details', {
    car: { model: 'Placeholder', topSpeed: 300 },
    isOwner: true,
    likedByCurrentUser: false,
    totalLikes: 3,
    likedEmails: ['example@mail.com']
  });
});

// GET /cars/:id/edit
router.get('/:id/edit', isAuthenticated, (req, res) => {
  res.render('edit', { car: {} });
});

// POST /cars/:id/edit
router.post('/:id/edit', isAuthenticated, (req, res) => {
  res.redirect(`/cars/${req.params.id}`);
});

// POST /cars/:id/delete
router.post('/:id/delete', isAuthenticated, (req, res) => {
  res.redirect('/cars');
});

// POST /cars/:id/like
router.post('/:id/like', isAuthenticated, (req, res) => {
  res.redirect(`/cars/${req.params.id}`);
});

export default router;
