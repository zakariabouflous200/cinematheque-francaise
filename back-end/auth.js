const jwt = require('jsonwebtoken');

// Définition du middleware d'authentification
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Authentification échouée' });
  }
};
module.exports = authMiddleware;