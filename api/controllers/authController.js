import bcrypt from 'bcrypt'
import { getDB, findUserByEmail, createUser, findUserById } from '../models/userModel.js'
import { generateToken, verifyToken } from '../utils/jwt.js'

export const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
        return res.status(409).json({ error: 'Email déjà utilisé' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser({ firstname, lastname, email, password: hashed, role: 'user' })

    const token = generateToken({ id: user.id, role: user.role })
    res.status(201).json({ token, user })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const token = generateToken({ id: user.id, role: user.role })
    res.json({ token, user })
}

export const resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' })
    }

    try {
        const user = await findUserById(userId)

        const valid = await bcrypt.compare(oldPassword, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Ancien mot de passe incorrect' })
        }

        const hashedNew = await bcrypt.hash(newPassword, 10)

        const db = await getDB()
        await db.run(
            `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [hashedNew, userId]
        )

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    if (!email) return res.status(400).json({ error: 'Email requis' })

    try {
        const user = await findUserByEmail(email)
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

        const token = generateToken({ id: user.id }, '15m') // token valable 15 min

        // Ici on simule l'envoi par email → on renvoie juste le lien
        const resetLink = `/reset-password/${token}`

        res.json({ message: 'Lien généré', resetLink })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la génération du lien' })
    }
}


export const publicResetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) return res.status(400).json({ error: 'Nouveau mot de passe requis' })

    try {
        const decoded = verifyToken(token)
        const user = await findUserById(decoded.id)
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

        const hashed = await bcrypt.hash(newPassword, 10)
        const db = await getDB()
        await db.run(
            `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [hashed, user.id]
        )

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Lien invalide ou expiré' })
    }
}

