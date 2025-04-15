import { getAllEmotions, getAllCategories } from '../models/emotionModel.js'


export const listEmotions = async (req, res) => {
    try {
        const emotions = await getAllEmotions()
        res.json(emotions)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la récupération des émotions' })
    }
}

export const listCategories = async (req, res) => {
    try {
        const categories = await getAllCategories()
        res.json(categories)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la récupération des catégories' })
    }
}