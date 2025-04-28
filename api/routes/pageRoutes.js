import express from 'express'
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js'
import {
    listPages,
    showPage,
    addPage,
    editPage,
    removePage
} from '../controllers/pageController.js'

const router = express.Router()

// Public
router.get('/', listPages)
router.get('/:id', showPage)

// Admin
router.post('/', authenticate, isAdmin, addPage)
router.patch('/:id', authenticate, isAdmin, editPage)
router.delete('/:id', authenticate, isAdmin, removePage)

export default router
