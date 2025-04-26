import { getAllEmotions, getAllCategories, insertEmotion, updateEmotionById, deleteEmotionById } from '../models/emotionModel.js'


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

export const createEmotion = async (req, res) => {
    const { label, category, emoji } = req.body;

    if (!label || !category) {
        return res.status(400).json({ error: 'Label et catégorie sont requis.' });
    }

    try {
        const emotion = await insertEmotion({ label, category, emoji });
        res.status(201).json(emotion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'émotion.' });
    }
};

export const updateEmotion = async (req, res) => {
    const { id } = req.params;
    const { label, category, emoji } = req.body;

    try {
        const emotion = await updateEmotionById(id, { label, category, emoji });
        res.json(emotion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'émotion.' });
    }
};

export const deleteEmotion = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteEmotionById(id);
        res.status(204).send(); // No Content
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'émotion.' });
    }
};