const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Movie = require('../models/movie');


// Fonction d'enregistrement d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10)

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Fonction de connexion d'un utilisateur existant
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`); 

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const passwordBd = user.password;

  const matching = await bcrypt.compareSync(password, passwordBd);

  console.log(matching); 

    if (!matching) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '999h' });

    res.json({
      message: 'User logged in successfully.',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


// Fonction pour ajouter un film à la liste de films à regarder d'un utilisateur
exports.addMovieToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $addToSet: { watchlist: movieId }
    }, { new: true }).populate('watchlist');

    res.json(updatedUser.watchlist);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Fonction pour ajouter un film regardé à la liste de films regardés d'un utilisateur
exports.addWatchedMovie = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $addToSet: { watchedMovies: movieId }
    }, { new: true }).populate('watchedMovies');

    res.json(updatedUser.watchedMovies);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Fonction pour ajouter un film aux favoris d'un utilisateur
exports.addMovieToFavorites = async (req, res) => {
  const { movieId } = req.body; 
  const userId = req.user.id; 

  try {
    
    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
      return res.status(404).json({ message: "Le film n'existe pas" });
    }

 
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $addToSet: { favoriteMovies: movieId } 
    }, { new: true });

    res.status(200).json({ message: "Film ajouté aux favoris", favorites: updatedUser.favoriteMovies });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}




// Fonction pour récupérer la liste des films favoris d'un utilisateur
exports.getFavoriteMovies = async (req, res) => {
  const userId = req.user.id;  

  try {
    const user = await User.findById(userId).populate('favoriteMovies');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log(user.favoriteMovies);
    res.json(user.favoriteMovies);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Fonction pour récupérer la liste des films regardés par un utilisateur
exports.getWatchedMovies = async (req, res) => {
  const userId = req.user.id;  

  try {
    const user = await User.findById(userId).populate('watchedMovies');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user.watchedMovies);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Fonction pour récupérer la liste des films à regarder par un utilisateur
exports.getWatchlistMovies = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('watchlist');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

