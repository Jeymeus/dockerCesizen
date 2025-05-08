import { verifyToken } from '../utils/jwt.js'
import { userRepository } from '../repositories/UserRepository.js'

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)
        const user = await userRepository.findById(decoded.id) // ← ✅

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' })
        }

        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).json({ error: 'Token invalide' })
    }
}


export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(404).json({ error: 'Route inexistante' }) // ✅ OK
    }
    next()
}

