const Car = require('../models/Car');
const User = require('../models/User');

exports.create = async (req, res) => {
  const { model, manufacturer, engine, topSpeed, image, description } = req.body;
  const errors = [];

  if (!model || model.length < 2) errors.push('Model must be at least 2 characters.');
  if (!manufacturer || manufacturer.length < 3) errors.push('Manufacturer must be at least 3 characters.');
  if (!engine || engine.length < 3) errors.push('Engine must be at least 3 characters.');
  if (!/^https?:\/\/.+/.test(image)) errors.push('Image must start with http:// or https://');
  if (!topSpeed || topSpeed < 10) errors.push('Top speed must be at least 2 digits.');
  if (!description || description.length < 5 || description.length > 500)
    errors.push('Description must be between 5 and 500 characters.');

  if (errors.length > 0) {
    return res.render('create', { errors, body: req.body });
  }

  try {
    await Car.create({
      model,
      manufacturer,
      engine,
      topSpeed,
      image,
      description,
      owner: req.user.id,
      likes: []
    });

    res.redirect('/cars');
  } catch (err) {
    res.render('create', { errors: [err.message], body: req.body });
  }
};

exports.getAll = async (req, res) => {
  const cars = await Car.find().lean();
  res.render('catalog', { cars });
};

exports.getDetails = async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner').lean();
  if (!car) return res.status(404).send('Not found');

  const isOwner = req.user && req.user.id == car.owner._id.toString();
  const hasLiked = req.user && car.likes.includes(req.user.id);
  const likedUsers = await User.find({ _id: { $in: car.likes } }).lean();

  res.render('details', {
    car,
    isOwner,
    hasLiked,
    likedEmails: likedUsers.map(u => u.email).join(', ') || 'No one has liked yet'
  });
};

exports.like = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) return res.redirect('/cars');

  if (car.owner.toString() === req.user.id || car.likes.includes(req.user.id)) {
    return res.redirect(`/cars/${req.params.id}`);
  }

  car.likes.push(req.user.id);
  await car.save();
  res.redirect(`/cars/${req.params.id}`);
};

exports.remove = async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car || car.owner.toString() !== req.user.id) return res.redirect('/cars');

  await Car.findByIdAndDelete(req.params.id);
  res.redirect('/cars');
};

exports.editForm = async (req, res) => {
  const car = await Car.findById(req.params.id).lean();
  if (!car || car.owner.toString() !== req.user.id) return res.redirect('/cars');

  res.render('edit', { car });
};

exports.edit = async (req, res) => {
  const { model, manufacturer, engine, topSpeed, image, description } = req.body;
  const car = await Car.findById(req.params.id);
  if (!car || car.owner.toString() !== req.user.id) return res.redirect('/cars');

  Object.assign(car, { model, manufacturer, engine, topSpeed, image, description });
  await car.save();
  res.redirect(`/cars/${req.params.id}`);
};

exports.myShowcase = async (req, res) => {
  const cars = await Car.find({ owner: req.user.id }).lean();
  res.render('my-showcase', { cars });
};
