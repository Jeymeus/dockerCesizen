import { menuRepository } from '../repositories/MenuRepository.js'

/**
 * 🔄 GET /menus
 * Récupère tous les menus triés par position
 */
export const listMenus = (req, res) => {
    try {
        const menus = menuRepository.findAll()
        res.json(menus)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des menus' })
    }
}

/**
 * 🔄 GET /menus/:id
 * Récupère un menu par son ID
 */
export const getMenuById = (req, res) => {
    try {
        const menu = menuRepository.findById(req.params.id)
        if (!menu) return res.status(404).json({ error: 'Menu non trouvé' })
        res.json(menu)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération du menu' })
    }
}

/**
 * 🆕 POST /menus
 * Crée un nouveau menu (admin uniquement)
 */
export const createMenu = (req, res) => {
    try {
        const menu = menuRepository.create(req.body)
        res.status(201).json(menu)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création du menu' })
    }
}

/**
 * ✏️ PUT /menus/:id
 * Met à jour un menu (admin uniquement)
 */
export const updateMenu = (req, res) => {
    try {
        const menu = menuRepository.update(req.params.id, req.body)
        res.json(menu)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la mise à jour du menu' })
    }
}

/**
 * 🗑️ DELETE /menus/:id
 * Supprime un menu (admin uniquement)
 */
export const deleteMenu = (req, res) => {
    try {
        const deleted = menuRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Menu introuvable ou déjà supprimé' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression du menu' })
    }
}
