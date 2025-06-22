import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  image: { type: String, required: true },
  model: { type: String, required: true, trim: true },
  topSpeed: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', carSchema);
export default Car;
