import { verifyToken } from '../utils/jwt.js'
import { findUserById } from '../models/userModel.js'

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        const user = await findUserById(decoded.id)

        if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' })

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token invalide' })
    }
}
