// // api/tests/controllers/pageController.test.js
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import {
//     listVisiblePages,
//     getPageById,
//     createPage,
//     updatePage,
//     deletePage,
//     getPagesByMenuId
// } from '../../controllers/pageController.js'
// import { pageRepository } from '../../repositories/PageRepository.js'
// import { menuRepository } from '../../repositories/MenuRepository.js'
// import { sanitizePagePayload } from '../../utils/sanitize.js'

// vi.mock('../../repositories/PageRepository.js')
// vi.mock('../../repositories/MenuRepository.js')
// vi.mock('../../utils/sanitize.js')

// describe('PageController', () => {
//     let req, res

//     beforeEach(() => {
//         vi.clearAllMocks()
//         req = {
//             params: { id: 1 },
//             query: { menuId: 1 },
//             body: {
//                 title: 'Test Page',
//                 url: 'https://example.com',
//                 content: 'Test content',
//                 visible: true,
//                 menu_id: 1
//             }
//         }
//         res = {
//             status: vi.fn().mockReturnThis(),
//             json: vi.fn(),
//             send: vi.fn()
//         }
//     })

//     describe('listVisiblePages', () => {
//         it('should return all visible pages', async () => {
//             // Arrange
//             const mockPages = [
//                 { id: 1, title: 'Page 1', visible: true },
//                 { id: 2, title: 'Page 2', visible: true }
//             ]
//             pageRepository.findAllVisible.mockResolvedValue(mockPages)

//             // Act
//             await listVisiblePages(req, res)

//             // Assert
//             expect(pageRepository.findAllVisible).toHaveBeenCalledWith(1)
//             expect(res.json).toHaveBeenCalledWith(mockPages)
//         })

//         it('should return visible pages without menu filter', async () => {
//             // Arrange
//             req.query.menuId = null
//             const mockPages = [
//                 { id: 1, title: 'Page 1', visible: true },
//                 { id: 2, title: 'Page 2', visible: true }
//             ]
//             pageRepository.findAllVisible.mockResolvedValue(mockPages)

//             // Act
//             await listVisiblePages(req, res)

//             // Assert
//             expect(pageRepository.findAllVisible).toHaveBeenCalledWith(null)
//             expect(res.json).toHaveBeenCalledWith(mockPages)
//         })

//         it('should handle errors when listing pages', async () => {
//             // Arrange
//             pageRepository.findAllVisible.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await listVisiblePages(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération des pages'
//             })
//         })
//     })

//     describe('getPageById', () => {
//         it('should return page by id', async () => {
//             // Arrange
//             const mockPage = { id: 1, title: 'Test Page', content: 'Test content' }
//             pageRepository.findById.mockResolvedValue(mockPage)

//             // Act
//             await getPageById(req, res)

//             // Assert
//             expect(pageRepository.findById).toHaveBeenCalledWith(1)
//             expect(res.json).toHaveBeenCalledWith(mockPage)
//         })

//         it('should return 404 if page not found', async () => {
//             // Arrange
//             pageRepository.findById.mockResolvedValue(null)

//             // Act
//             await getPageById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Page non trouvée'
//             })
//         })

//         it('should handle errors when getting page by id', async () => {
//             // Arrange
//             pageRepository.findById.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await getPageById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération de la page'
//             })
//         })
//     })

//     describe('createPage', () => {
//         it('should create a new page', async () => {
//             // Arrange
//             const cleanData = {
//                 title: 'Test Page',
//                 url: 'https://example.com',
//                 content: 'Test content',
//                 visible: true,
//                 menuId: 1
//             }
//             const mockPage = { id: 1, ...cleanData }

//             sanitizePagePayload.mockReturnValue(cleanData)
//             pageRepository.create.mockResolvedValue(mockPage)

//             // Act
//             await createPage(req, res)

//             // Assert
//             expect(sanitizePagePayload).toHaveBeenCalledWith(req.body)
//             expect(pageRepository.create).toHaveBeenCalledWith(cleanData)
//             expect(res.status).toHaveBeenCalledWith(201)
//             expect(res.json).toHaveBeenCalledWith(mockPage)
//         })

//         it('should handle errors when creating page', async () => {
//             // Arrange
//             sanitizePagePayload.mockReturnValue(req.body)
//             pageRepository.create.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await createPage(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(400)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la création de la page'
//             })
//         })
//     })

//     describe('updatePage', () => {
//         it('should update an existing page', async () => {
//             // Arrange
//             const cleanData = {
//                 title: 'Updated Page',
//                 url: 'https://example.com/updated',
//                 content: 'Updated content',
//                 visible: false,
//                 menuId: 2
//             }
//             const mockPage = { id: 1, ...cleanData }

//             sanitizePagePayload.mockReturnValue(cleanData)
//             pageRepository.update.mockResolvedValue(mockPage)

//             // Act
//             await updatePage(req, res)

//             // Assert
//             expect(sanitizePagePayload).toHaveBeenCalledWith(req.body)
//             expect(pageRepository.update).toHaveBeenCalledWith(1, cleanData)
//             expect(res.json).toHaveBeenCalledWith(mockPage)
//         })

//         it('should handle errors when updating page', async () => {
//             // Arrange
//             sanitizePagePayload.mockReturnValue(req.body)
//             pageRepository.update.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await updatePage(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(400)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la mise à jour de la page'
//             })
//         })
//     })

//     describe('deletePage', () => {
//         it('should delete a page', async () => {
//             // Arrange
//             pageRepository.delete.mockResolvedValue(true)

//             // Act
//             await deletePage(req, res)

//             // Assert
//             expect(pageRepository.delete).toHaveBeenCalledWith(1)
//             expect(res.status).toHaveBeenCalledWith(204)
//             expect(res.send).toHaveBeenCalled()
//         })

//         it('should return 404 if page not found for deletion', async () => {
//             // Arrange
//             pageRepository.delete.mockResolvedValue(false)

//             // Act
//             await deletePage(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Page introuvable ou déjà supprimée'
//             })
//         })

//         it('should handle errors when deleting page', async () => {
//             // Arrange
//             pageRepository.delete.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await deletePage(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la suppression de la page'
//             })
//         })
//     })

//     describe('getPagesByMenuId', () => {
//         it('should get pages by menu id', async () => {
//             // Arrange
//             const mockMenu = { id: 1, title: 'Test Menu' }
//             const mockPages = [
//                 { id: 1, title: 'Page 1', menu_id: 1 },
//                 { id: 2, title: 'Page 2', menu_id: 1 }
//             ]

//             menuRepository.findById.mockResolvedValue(mockMenu)
//             pageRepository.findByMenuId.mockResolvedValue(mockPages)

//             // Act
//             await getPagesByMenuId(req, res)

//             // Assert
//             expect(menuRepository.findById).toHaveBeenCalledWith(1)
//             expect(pageRepository.findByMenuId).toHaveBeenCalledWith(1)
//             expect(res.json).toHaveBeenCalledWith({
//                 menu: mockMenu,
//                 pages: mockPages
//             })
//         })

//         it('should return 404 if menu not found', async () => {
//             // Arrange
//             menuRepository.findById.mockResolvedValue(null)

//             // Act
//             await getPagesByMenuId(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Menu introuvable'
//             })
//         })

//         it('should handle errors when getting pages by menu id', async () => {
//             // Arrange
//             menuRepository.findById.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await getPagesByMenuId(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur serveur'
//             })
//         })
//     })
// })