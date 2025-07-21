import jwt from 'jsonwebtoken'

// À charger depuis .env en prod (via dotenv)
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET non défini. Ajoute-le dans le fichier .env.");
}
const SECRET = process.env.JWT_SECRET;

/**
 * Génère un token JWT avec payload personnalisé
 * @param {Object} payload - Données à encoder
 * @param {string} expiresIn - Durée de validité (par défaut : 7 jours)
 * @returns {string} Token signé
 */
export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, SECRET, { expiresIn })
}

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Le token JWT à vérifier
 * @returns {Object} Payload décodé si valide, sinon lève une erreur
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET)
    } catch (err) {
        console.error('Erreur de vérification du token JWT:', err)
        throw new Error('Token invalide ou expiré')
    }
}
