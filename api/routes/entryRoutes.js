import express from 'express'
import {
    listMyEntries,
    getEntryById,
    addEntry,
    editEntry,
    removeEntry,
    getMyReport
} from '../controllers/entryController.js'

import { authenticateToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

// 🔄 Lister toutes les entrées de l'utilisateur connecté
router.get('/', authenticateToken, listMyEntries)

// 🔄 Récupérer une entrée par son ID
router.get('/:id', authenticateToken, getEntryById)

// 🆕 Créer une nouvelle entrée
router.post('/', authenticateToken, addEntry)

// ✏️ Modifier une entrée existante
router.put('/:id', authenticateToken, editEntry)

// 🗑️ Supprimer une entrée
router.delete('/:id', authenticateToken, removeEntry)

// 📊 Générer un rapport d'émotions par période
router.get('/report/user', authenticateToken, getMyReport)

export default router
