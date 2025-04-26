import express from 'express'
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js'
import { listEmotions, listCategories, createEmotion, updateEmotion, deleteEmotion } from '../controllers/emotionController.js'

const router = express.Router()

router.get('/', listEmotions)
router.get('/categories', listCategories)

// Routes protégées
router.post('/', authenticate, isAdmin, createEmotion);
router.patch('/:id', authenticate, isAdmin, updateEmotion);
router.delete('/:id', authenticate, isAdmin, deleteEmotion);

export default router
