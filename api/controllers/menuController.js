import { getAllMenus, createMenu, updateMenu, deleteMenu } from '../models/menuModel.js'

export const listMenus = async (req, res) => {
    try {
        const menus = await getAllMenus()
        res.json(menus)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la récupération des menus" })
    }
}

export const addMenu = async (req, res) => {
    const { title } = req.body
    if (!title) return res.status(400).json({ error: "Titre requis" })

    try {
        const menu = await createMenu(title)
        res.status(201).json(menu)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la création du menu" })
    }
}

export const editMenu = async (req, res) => {
    const { id } = req.params
    const { title } = req.body

    try {
        const menu = await updateMenu(id, title)
        res.json(menu)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la modification du menu" })
    }
}

export const removeMenu = async (req, res) => {
    const { id } = req.params

    try {
        await deleteMenu(id)
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Erreur lors de la suppression du menu" })
    }
}
