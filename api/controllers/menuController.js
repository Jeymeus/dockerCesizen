import { menuRepository } from '../repositories/MenuRepository.js'
import { sanitizeMenuPayload } from '../utils/sanitize.js'

/**
 * 🔄 GET /menus
 */
export const listMenus = async (req, res) => {
    try {
        const menus = await menuRepository.findAll()
        res.json(menus)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des menus' })
    }
}

/**
 * 🔄 GET /menus/:id
 */
export const getMenuById = async (req, res) => {
    try {
        const menu = await menuRepository.findById(req.params.id)
        if (!menu) return res.status(404).json({ error: 'Menu non trouvé' })
        res.json(menu)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération du menu' })
    }
}

/**
 * 🆕 POST /menus
 */
export const createMenu = async (req, res) => {
    try {
        const clean = sanitizeMenuPayload(req.body)
        const menu = await menuRepository.create(clean)
        res.status(201).json(menu)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création du menu' })
    }
}

/**
 * ✏️ PUT /menus/:id
 */
export const updateMenu = async (req, res) => {

    const id = parseInt(req.params.id)
    const data = req.body

    try {
        const updated = await menuRepository.update(id, data)
        res.json(updated)
    } catch (e) {
        console.error('Erreur update menu:', e.message)
        res.status(500).json({ error: 'Erreur interne' })
    }
}
  

/**
 * 🗑️ DELETE /menus/:id
 */
export const deleteMenu = async (req, res) => {
    try {
        const deleted = await menuRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Menu introuvable ou déjà supprimé' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression du menu' })
    }
}
