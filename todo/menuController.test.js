// // api/tests/controllers/menuController.test.js
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import {
//     listMenus,
//     getMenuById,
//     createMenu,
//     updateMenu,
//     deleteMenu
// } from '../../controllers/menuController.js'
// import { menuRepository } from '../../repositories/MenuRepository.js'
// import { sanitizeMenuPayload } from '../../utils/sanitize.js'

// vi.mock('../../repositories/MenuRepository.js')
// vi.mock('../../utils/sanitize.js')

// describe('MenuController', () => {
//     let req, res

//     beforeEach(() => {
//         vi.clearAllMocks()
//         req = {
//             params: { id: 1 },
//             body: {
//                 title: 'Test Menu',
//                 type: 'articles'
//             }
//         }
//         res = {
//             status: vi.fn().mockReturnThis(),
//             json: vi.fn(),
//             send: vi.fn()
//         }
//     })

//     describe('listMenus', () => {
//         it('should return all menus', async () => {
//             // Arrange
//             const mockMenus = [
//                 { id: 1, title: 'Articles', type: 'articles' },
//                 { id: 2, title: 'Vidéos', type: 'videos' }
//             ]
//             menuRepository.findAll.mockResolvedValue(mockMenus)

//             // Act
//             await listMenus(req, res)

//             // Assert
//             expect(res.json).toHaveBeenCalledWith(mockMenus)
//         })

//         it('should handle errors when listing menus', async () => {
//             // Arrange
//             menuRepository.findAll.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await listMenus(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération des menus'
//             })
//         })
//     })

//     describe('getMenuById', () => {
//         it('should return menu by id', async () => {
//             // Arrange
//             const mockMenu = { id: 1, title: 'Test Menu', type: 'articles' }
//             menuRepository.findById.mockResolvedValue(mockMenu)

//             // Act
//             await getMenuById(req, res)

//             // Assert
//             expect(menuRepository.findById).toHaveBeenCalledWith(1)
//             expect(res.json).toHaveBeenCalledWith(mockMenu)
//         })

//         it('should return 404 if menu not found', async () => {
//             // Arrange
//             menuRepository.findById.mockResolvedValue(null)

//             // Act
//             await getMenuById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Menu non trouvé'
//             })
//         })

//         it('should handle errors when getting menu by id', async () => {
//             // Arrange
//             menuRepository.findById.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await getMenuById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération du menu'
//             })
//         })
//     })

//     describe('createMenu', () => {
//         it('should create a new menu', async () => {
//             // Arrange
//             const cleanData = { title: 'Test Menu', type: 'articles' }
//             const mockMenu = { id: 1, ...cleanData }

//             sanitizeMenuPayload.mockReturnValue(cleanData)
//             menuRepository.create.mockResolvedValue(mockMenu)

//             // Act
//             await createMenu(req, res)

//             // Assert
//             expect(sanitizeMenuPayload).toHaveBeenCalledWith(req.body)
//             expect(menuRepository.create).toHaveBeenCalledWith(cleanData)
//             expect(res.status).toHaveBeenCalledWith(201)
//             expect(res.json).toHaveBeenCalledWith(mockMenu)
//         })

//         it('should handle errors when creating menu', async () => {
//             // Arrange
//             sanitizeMenuPayload.mockReturnValue(req.body)
//             menuRepository.create.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await createMenu(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(400)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la création du menu'
//             })
//         })
//     })

//     describe('updateMenu', () => {
//         it('should update an existing menu', async () => {
//             // Arrange
//             const mockMenu = { id: 1, title: 'Updated Menu', type: 'videos' }
//             menuRepository.update.mockResolvedValue(mockMenu)

//             // Act
//             await updateMenu(req, res)

//             // Assert
//             expect(menuRepository.update).toHaveBeenCalledWith(1, req.body)
//             expect(res.json).toHaveBeenCalledWith(mockMenu)
//         })

//         it('should handle errors when updating menu', async () => {
//             // Arrange
//             menuRepository.update.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await updateMenu(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur interne'
//             })
//         })
//     })

//     describe('deleteMenu', () => {
//         it('should delete a menu', async () => {
//             // Arrange
//             menuRepository.delete.mockResolvedValue(true)

//             // Act
//             await deleteMenu(req, res)

//             // Assert
//             expect(menuRepository.delete).toHaveBeenCalledWith(1)
//             expect(res.status).toHaveBeenCalledWith(204)
//             expect(res.send).toHaveBeenCalled()
//         })

//         it('should return 404 if menu not found for deletion', async () => {
//             // Arrange
//             menuRepository.delete.mockResolvedValue(false)

//             // Act
//             await deleteMenu(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Menu introuvable ou déjà supprimé'
//             })
//         })

//         it('should handle errors when deleting menu', async () => {
//             // Arrange
//             menuRepository.delete.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await deleteMenu(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la suppression du menu'
//             })
//         })
//     })
// })