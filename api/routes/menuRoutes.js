import express from 'express'
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js'
import { listMenus, addMenu, editMenu, removeMenu } from '../controllers/menuController.js'

const router = express.Router()

// Public
router.get('/', listMenus)

// Admin
router.post('/', authenticate, isAdmin, addMenu)
router.patch('/:id', authenticate, isAdmin, editMenu)
router.delete('/:id', authenticate, isAdmin, removeMenu)

export default router
