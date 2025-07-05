import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/UserRepository.js'
import { generateToken, verifyToken } from '../utils/jwt.js'
import db from '../database/db.js';

// 🆕 POST /auth/register
export const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const existing = await userRepository.findByEmail(email)
    if (existing) {
        return res.status(409).json({ error: 'Email déjà utilisé' })
    }

    try {
        const hashed = await bcrypt.hash(password, 10)

        const user = await userRepository.create({
            firstname,
            lastname,
            email,
            password: hashed,
            role: req.body.role ?? 'user'
        })

        const token = generateToken({ id: user.id, role: user.role })
        res.status(201).json({ token, user })
    } catch (error) {
        console.error('[register] Erreur :', error.message)
        res.status(400).json({ error: error.message })
    }
}

// 🔑 POST /auth/login
export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userRepository.findByEmail(email)
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const token = generateToken({ id: user.id, role: user.role })
    res.json({ token, user })
}

// ✏️ PATCH /auth/reset-password
export const resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' })
    }

    try {
        const user = await userRepository.findById(userId)
        const valid = await bcrypt.compare(oldPassword, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Ancien mot de passe incorrect' })
        }

        const hashedNew = await bcrypt.hash(newPassword, 10)
        await db.execute(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashedNew, userId]
        )

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' })
    }
}

// 📧 POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
    const { email } = req.body

    if (!email) return res.status(400).json({ error: 'Email requis' })

    try {
        const user = await userRepository.findByEmail(email)
        if (!user) return res.status(404).json({ error: `Si l'utilisateur existe vous recevrez un lien de réinitialisation sur votre boite mail` })

        const token = generateToken({ id: user.id }, '15m')
        const resetLink = `/reset-password/${token}`

        res.json({ message: 'Lien généré', resetLink })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la génération du lien' })
    }
}

// 🔁 POST /auth/reset-password/:token
export const publicResetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) return res.status(400).json({ error: 'Nouveau mot de passe requis' })

    try {
        const decoded = verifyToken(token)
        const user = await userRepository.findById(decoded.id)
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

        const hashed = await bcrypt.hash(newPassword, 10)
        await db.execute(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashed, user.id]
        )

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Lien invalide ou expiré' })
    }
}