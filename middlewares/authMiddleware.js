const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ success: false, message: 'Accès non autorisé. Token manquant.' });
    }

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
    }
};

module.exports = authenticateToken;
