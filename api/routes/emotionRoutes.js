import express from 'express'
import {
    listEmotions,
    getEmotionById,
    createEmotion,
    updateEmotion,
    deleteEmotion
} from '../controllers/emotionController.js'

import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authenticateToken, listEmotions)
router.get('/:id', authenticateToken, getEmotionById)
router.post('/', authenticateToken, requireAdmin, createEmotion)
router.put('/:id', authenticateToken, requireAdmin, updateEmotion)
router.delete('/:id', authenticateToken, requireAdmin, deleteEmotion)

export default router
