import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import {
    addEntry,
    editEntry,
    removeEntry,
    listMyEntries,
    getMyReport
} from '../controllers/journalController.js'

const router = express.Router()

// Toutes les routes ici nécessitent l'authentification
router.use(authenticate)

// ➔ Lister ses entrées du journal
router.get('/', listMyEntries)

// ➔ Ajouter une émotion dans son journal
router.post('/', addEntry)

// ➔ Modifier une entrée du journal
router.patch('/:id', editEntry)

// ➔ Supprimer une entrée du journal
router.delete('/:id', removeEntry)

// ➔ Générer un rapport (ex: semaine, mois, trimestre, année)
router.get('/report', getMyReport)

export default router
