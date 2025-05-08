import { verifyToken } from '../utils/jwt.js'
import { userRepository } from '../repositories/UserRepository.js'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        const user = userRepository.findById(decoded.id)

        if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' })

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Token invalide' })
    }
}

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        // ✅ Bonne pratique : masquer l'existence de la ressource
        return res.status(404).json({ error: 'Route inexistante' })
    }
    next()
}
