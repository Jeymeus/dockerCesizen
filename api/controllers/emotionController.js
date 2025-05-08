import { emotionRepository } from '../repositories/EmotionRepository.js'

/**
 * 🔄 GET /emotions
 * Récupère toutes les émotions
 */
export const listEmotions = (req, res) => {
    try {
        const emotions = emotionRepository.findAll()
        res.json(emotions)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des émotions' })
    }
}

/**
 * 🔄 GET /emotions/:id
 * Récupère une émotion par son ID
 */
export const getEmotionById = (req, res) => {
    try {
        const emotion = emotionRepository.findById(req.params.id)
        if (!emotion) return res.status(404).json({ error: 'Émotion non trouvée' })
        res.json(emotion)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération de l’émotion' })
    }
}

/**
 * 🆕 POST /emotions
 * Crée une nouvelle émotion (admin uniquement)
 */
export const createEmotion = (req, res) => {
    try {
        const { label, category, emoji } = req.body
        const emotion = emotionRepository.create({ label, category, emoji })
        res.status(201).json(emotion)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la création de l’émotion' })
    }
}

/**
 * ✏️ PUT /emotions/:id
 * Met à jour une émotion (admin uniquement)
 */
export const updateEmotion = (req, res) => {
    try {
        const { label, category, emoji } = req.body
        const emotion = emotionRepository.update(req.params.id, { label, category, emoji })
        res.json(emotion)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Erreur lors de la mise à jour de l’émotion' })
    }
}

/**
 * 🗑️ DELETE /emotions/:id
 * Supprime une émotion (admin uniquement)
 */
export const deleteEmotion = (req, res) => {
    try {
        const deleted = emotionRepository.delete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Émotion introuvable ou déjà supprimée' })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression de l’émotion' })
    }
}
