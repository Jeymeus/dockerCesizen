import {
    insertEntry,
    updateEntry,
    deleteEntry,
    getEntriesByUser,
    getEntryById,
    getReportByPeriod
} from '../models/journalModel.js'

// ➡ Ajouter une émotion au journal
export const addEntry = async (req, res) => {
    const { emotionId, note, dateEntry } = req.body
    const userId = req.user.id

    if (!emotionId || !dateEntry) {
        return res.status(400).json({ error: 'Emotion ID et date d\'entrée requis' })
    }

    try {
        const entry = await insertEntry({ userId, emotionId, note, dateEntry })
        res.status(201).json(entry)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de l\'ajout d\'une émotion au journal' })
    }
}

// ➡ Modifier une émotion enregistrée
export const editEntry = async (req, res) => {
    const { id } = req.params
    const { emotionId, note, dateEntry } = req.body
    const userId = req.user.id

    try {
        const existing = await getEntryById(id)

        if (!existing || existing.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit ou entrée inexistante' })
        }

        const entry = await updateEntry(id, { emotionId, note, dateEntry })
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
        const existing = await getEntryById(id)

        if (!existing || existing.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit ou entrée inexistante' })
        }

        await deleteEntry(id)
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
        const entries = await getEntriesByUser(userId)
        res.json(entries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la récupération du journal' })
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
        const report = await getReportByPeriod(userId, start, end)
        res.json(report)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la génération du rapport' })
    }
}
