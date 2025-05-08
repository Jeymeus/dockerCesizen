import { emotionRepository } from '../repositories/EmotionRepository.js'

/**
 * 🔄 GET /emotions
 */
export const listEmotions = async (req, res) => {
    try {
        const emotions = await emotionRepository.findAll()
        res.json(emotions)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des émotions' })
    }
}

/**
 * 🔄 GET /emotions/:id
 */
export const getEmotionById = async (req, res) => {
    try {
        const emotion = await emotionRepository.findById(req.params.id)
        if (!emotion) return res.status(404).json({ error: 'Émotion non trouvée' })
        res.json(emotion)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération de l’émotion' })
    }
}

/**
 * 🆕 POST /emotions
 */
export const createEmotion = async (req, res) => {
    try {
        const { label, category, emoji } = req.body
        const emotion = await emotionRepository.create({ label, category, emoji })
        res.status(201).json(emotion)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création de l’émotion' })
    }
}

/**
 * ✏️ PUT /emotions/:id
 */
export const updateEmotion = async (req, res) => {
    try {
        const { label, category, emoji } = req.body
        const emotion = await emotionRepository.update(req.params.id, { label, category, emoji })
        res.json(emotion)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la mise à jour de l’émotion' })
    }
}

/**
 * 🗑️ DELETE /emotions/:id
 */
export const deleteEmotion = async (req, res) => {
    try {
        const deleted = await emotionRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Émotion introuvable ou déjà supprimée' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression de l’émotion' })
    }
}
