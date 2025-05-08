import { entryRepository } from '../repositories/EntryRepository.js'

// ➡ Ajouter une émotion au journal
export const addEntry = async (req, res) => {
    const { emotion_id, note, date_entry } = req.body
    const userId = req.user.id

    if (!emotion_id || !date_entry) {
        return res.status(400).json({ error: 'Emotion ID et date d\'entrée requis' })
    }

    try {
        // Création de l'entrée via le Repository
        const entry = await entryRepository.create({ user_id: userId, emotion_id, note, date_entry })
        res.status(201).json(entry)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de l\'ajout d\'une émotion au journal' })
    }
}

// ➡ Modifier une émotion enregistrée
export const editEntry = async (req, res) => {
    const { id } = req.params
    const { emotion_id, note, date_entry } = req.body
    const userId = req.user.id

    try {
        const existing = await entryRepository.findById(id)

        if (!existing || existing.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit ou entrée inexistante' })
        }

        // Mise à jour de l'entrée via le Repository
        const entry = await entryRepository.update(id, { emotion_id, note, date_entry })
        res.json(entry)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la modification de l\'entrée' })
    }
}

// ➡ Supprimer une émotion enregistrée
export const removeEntry = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const existing = await entryRepository.findById(id)

        if (!existing || existing.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit ou entrée inexistante' })
        }

        // Suppression de l'entrée via le Repository
        const deleted = await entryRepository.delete(id)
        if (!deleted) return res.status(404).json({ error: 'Entrée introuvable ou déjà supprimée' })

        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'entrée' })
    }
}

// ➡ Lister ses propres entrées
export const listMyEntries = async (req, res) => {
    const userId = req.user.id

    try {
        const entries = await entryRepository.findByUser(userId)
        res.json(entries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération du journal' })
    }
}

// ➡ Récupérer une entrée par son ID
export const getEntryById = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const entry = await entryRepository.findById(id)

        if (!entry || entry.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit ou entrée introuvable' })
        }

        res.json(entry)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'entrée' })
    }
}

// ➡ Voir un rapport par période
export const getMyReport = async (req, res) => {
    const userId = req.user.id
    const { period } = req.query

    if (!['week', 'month', 'quarter', 'year'].includes(period)) {
        return res.status(400).json({ error: 'Période invalide' })
    }

    // ➔ On calcule la date de début en fonction de la période
    const today = new Date()
    let startDate = new Date()

    if (period === 'week') {
        startDate.setDate(today.getDate() - 7)
    } else if (period === 'month') {
        startDate.setMonth(today.getMonth() - 1)
    } else if (period === 'quarter') {
        startDate.setMonth(today.getMonth() - 3)
    } else if (period === 'year') {
        startDate.setFullYear(today.getFullYear() - 1)
    }

    const start = startDate.toISOString().split('T')[0]
    const end = today.toISOString().split('T')[0]

    try {
        // Récupération du rapport par période via le Repository
        const report = await entryRepository.getReportByPeriod(userId, start, end)
        res.json(report)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la génération du rapport' })
    }
}
