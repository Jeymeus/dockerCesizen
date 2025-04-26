import { findUserById, updateUserProfile, updateUserRole, deleteUser, findAllUsers, setUserActiveStatus  } from '../models/userModel.js'

// Permet à l'utilisateur connecté de modifier son propre profil
export const updateProfile = async (req, res) => {
    const { firstname, lastname, email } = req.body
    const userId = req.user.id

    if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    try {
        const updatedUser = await updateUserProfile(userId, { firstname, lastname, email })
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la mise à jour du profil" })
    }
}

// Permet à un admin de changer le rôle d'un utilisateur
export const changeUserRole = async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' })
    }

    try {
        const updatedUser = await updateUserRole(id, role)
        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors du changement de rôle" })
    }
}

// Permet à un admin de d'activer/désactiver un compte utilisateur
export const updateUserActiveStatus = async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== 'boolean') {
        return res.status(400).json({ error: "Le champ 'active' doit être un booléen." });
    }

    try {
        const updatedUser = await setUserActiveStatus(id, active);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du statut du compte" });
    }
}


// Permet à un admin de supprimer un compte utilisateur
export const removeAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        await deleteUser(id);
        return res.status(204).send(); // No Content
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression du compte" });
    }
}


export const listUsers = async (req, res) => {
    try {
        const users = await findAllUsers()
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" })
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await findUserById(id)
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" })
    }
}


