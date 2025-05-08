import { pageRepository } from '../repositories/PageRepository.js'

/**
 * 🔄 GET /pages
 * Liste toutes les pages visibles (optionnel : filtrer par menu)
 */
export const listVisiblePages = (req, res) => {
    try {
        const menuId = req.query.menuId ? parseInt(req.query.menuId) : null
        const pages = pageRepository.findAllVisible(menuId)
        res.json(pages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des pages' })
    }
}

/**
 * 🔄 GET /pages/:id
 * Récupère une page visible par son ID
 */
export const getPageById = (req, res) => {
    try {
        const page = pageRepository.findById(req.params.id)
        if (!page) return res.status(404).json({ error: 'Page non trouvée' })
        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération de la page' })
    }
}

/**
 * 🆕 POST /pages
 * Crée une nouvelle page (admin uniquement)
 */
export const createPage = (req, res) => {
    try {
        const page = pageRepository.create(req.body)
        res.status(201).json(page)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création de la page' })
    }
}

/**
 * ✏️ PUT /pages/:id
 * Met à jour une page (admin uniquement)
 */
export const updatePage = (req, res) => {
    try {
        const page = pageRepository.update(req.params.id, req.body)
        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la mise à jour de la page' })
    }
}

/**
 * 🗑️ DELETE /pages/:id
 * Supprime une page (admin uniquement)
 */
export const deletePage = (req, res) => {
    try {
        const deleted = pageRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Page introuvable ou déjà supprimée' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression de la page' })
    }
}
