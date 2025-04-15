import express from 'express'
import { listEmotions, listCategories } from '../controllers/emotionController.js'

const router = express.Router()

router.get('/', listEmotions)
router.get('/categories', listCategories)

export default router
