import {
    getVisiblePages,
    getPageById,
    createPage,
    updatePage,
    deletePage
} from '../models/pageModel.js'

// ➔ Lister les pages visibles (optionnel menuId en query)
export const listPages = async (req, res) => {
    const { menuId } = req.query

    try {
        const pages = await getVisiblePages(menuId)
        res.json(pages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération des pages" })
    }
}

// ➔ Voir une page spécifique
export const showPage = async (req, res) => {
    const { id } = req.params

    try {
        const page = await getPageById(id)
        if (!page) return res.status(404).json({ error: "Page non trouvée" })

        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération de la page" })
    }
}

// ➔ Créer une page (admin)
export const addPage = async (req, res) => {
    const { menuId, title, url, content, visible } = req.body

    if (!menuId || !title || !url) {
        return res.status(400).json({ error: "Menu ID, titre et URL requis" })
    }

    try {
        const page = await createPage({ menuId, title, url, content, visible: visible ? 1 : 0 })
        res.status(201).json(page)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la création de la page" })
    }
}

// ➔ Modifier une page (admin)
export const editPage = async (req, res) => {
    const { id } = req.params
    const { menuId, title, url, content, visible } = req.body

    try {
        const page = await updatePage(id, { menuId, title, url, content, visible: visible ? 1 : 0 })
        res.json(page)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la mise à jour de la page" })
    }
}

// ➔ Supprimer une page (admin)
export const removePage = async (req, res) => {
    const { id } = req.params

    try {
        await deletePage(id)
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la suppression de la page" })
    }
}
