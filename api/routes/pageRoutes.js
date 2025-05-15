import express from 'express'
import {
    listVisiblePages,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    getPagesByMenuId
} from '../controllers/pageController.js'

import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', listVisiblePages)
router.get('/:id', getPageById)
router.post('/', authenticateToken, requireAdmin, createPage)
router.put('/:id', authenticateToken, requireAdmin, updatePage)
router.delete('/:id', authenticateToken, requireAdmin, deletePage)
router.get('/menu/:id', getPagesByMenuId)



export default router
