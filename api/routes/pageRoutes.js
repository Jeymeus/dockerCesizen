import express from 'express'
import {
    listVisiblePages,
    getPageById,
    createPage,
    updatePage,
    deletePage
} from '../controllers/pageController.js'

import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', listVisiblePages)
router.get('/:id', getPageById)
router.post('/', authenticateToken, requireAdmin, createPage)
router.put('/:id', authenticateToken, requireAdmin, updatePage)
router.delete('/:id', authenticateToken, requireAdmin, deletePage)

export default router
