import express from 'express'
import {
    listMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
} from '../controllers/menuController.js'

import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', listMenus)
router.get('/:id', getMenuById)
router.post('/', authenticateToken, requireAdmin, createMenu)
router.put('/:id', authenticateToken, requireAdmin, updateMenu)
router.delete('/:id', authenticateToken, requireAdmin, deleteMenu)

export default router