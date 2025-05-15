import { pageRepository } from '../repositories/PageRepository.js'
import { menuRepository } from '../repositories/MenuRepository.js'
import { sanitizePagePayload } from '../utils/sanitize.js'

/**
 * 🔄 GET /pages
 */
export const listVisiblePages = async (req, res) => {
    try {
        const menuId = req.query.menuId ? parseInt(req.query.menuId) : null
        const pages = await pageRepository.findAllVisible(menuId)
        res.json(pages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des pages' })
    }
}

/**
 * 🔄 GET /pages/:id
 */
export const getPageById = async (req, res) => {
    try {
        const page = await pageRepository.findById(req.params.id)
        if (!page) return res.status(404).json({ error: 'Page non trouvée' })
        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération de la page' })
    }
}

/**
 * 🆕 POST /pages
 */
export const createPage = async (req, res) => {
    try {
        const clean = sanitizePagePayload(req.body)
        const page = await pageRepository.create(clean)
        res.status(201).json(page)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création de la page' })
    }
}

/**
 * ✏️ PUT /pages/:id
 */
export const updatePage = async (req, res) => {
    try {
        const clean = sanitizePagePayload(req.body)
        const page = await pageRepository.update(req.params.id, clean)
        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la mise à jour de la page' })
    }
}


/**
 * 🗑️ DELETE /pages/:id
 */
export const deletePage = async (req, res) => {
    try {
        const deleted = await pageRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Page introuvable ou déjà supprimée' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression de la page' })
    }
}

export const getPagesByMenuId = async (req, res) => {
    try {
        const menu = await menuRepository.findById(req.params.id)
        if (!menu) return res.status(404).json({ error: 'Menu introuvable' })

        const pages = await pageRepository.findByMenuId(menu.id)
        res.json({ menu, pages })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
}
  
