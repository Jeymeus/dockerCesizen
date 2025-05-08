import { userRepository } from '../repositories/UserRepository.js'
import { verifyToken } from '../utils/jwt.js'

/**
 * 🔄 GET /users
 * Liste tous les utilisateurs (admin uniquement)
 */
export const listUsers = async (req, res) => {
    try {
        const users = await userRepository.findAll()
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' })
    }
}

/**
 * 🔄 GET /users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const user = await userRepository.findById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" })
    }
}

/**
 * ✏️ PUT /users/profile
 */
export const updateProfile = async (req, res) => {
    const { firstname, lastname, email } = req.body
    const userId = req.user?.id

    if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    try {
        const updatedUser = await userRepository.update(userId, { firstname, lastname, email })
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' })
    }
}

/**
 * ✏️ PATCH /users/:id/role
 */
export const changeUserRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' })
    }

    try {
        const updatedUser = await userRepository.updateRole(id, role)
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors du changement de rôle" })
    }
}

/**
 * ✏️ PATCH /users/:id/active
 */
export const updateUserActiveStatus = async (req, res) => {
    const { id } = req.params
    const { active } = req.body

    if (typeof active !== 'boolean') {
        return res.status(400).json({ error: "Le champ 'active' doit être un booléen." })
    }

    try {
        const updatedUser = await userRepository.setActive(id, active)
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut du compte' })
    }
}

/**
 * 🗑️ DELETE /users/:id
 */
export const removeAccount = async (req, res) => {
    try {
        const user = await userRepository.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }

        const deleted = await userRepository.delete(req.params.id)
        if (!deleted) {
            return res.status(500).json({ error: 'Erreur lors de la suppression' })
        }

        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression du compte' })
    }
}

/**
 * 👤 GET /users/me
 */
export const getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' })
    }

    try {
        const decoded = verifyToken(token)
        const user = await userRepository.findById(decoded.id)

        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })

        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: 'Token invalide' })
    }
}
