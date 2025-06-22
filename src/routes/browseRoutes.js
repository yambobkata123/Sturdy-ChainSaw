import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().lean(); // lean() for plain JS objects Handlebars likes
    res.render('browse', { cars, title: 'Browse Cars' });
  } catch (err) {
    console.error(err);
    res.render('browse', { cars: [], title: 'Browse Cars' });
  }
});

export default router;
