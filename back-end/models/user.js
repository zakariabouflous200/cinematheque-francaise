const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});



const User = mongoose.model('User', userSchema);
module.exports = User;
