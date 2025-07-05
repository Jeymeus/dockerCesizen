// // api/tests/controllers/emotionController.test.js
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import {
//     listEmotions,
//     getEmotionById,
//     createEmotion,
//     updateEmotion,
//     deleteEmotion
// } from '../../controllers/emotionController.js'
// import { emotionRepository } from '../../repositories/EmotionRepository.js'

// vi.mock('../repositories/EmotionRepository.js')

// describe('EmotionController', () => {
//     let req, res

//     beforeEach(() => {
//         vi.clearAllMocks()
//         req = {
//             params: { id: 1 },
//             body: {
//                 label: 'Joie',
//                 category: 'Positive',
//                 emoji: '😊'
//             }
//         }
//         res = {
//             status: vi.fn().mockReturnThis(),
//             json: vi.fn(),
//             send: vi.fn()
//         }
//     })

//     describe('listEmotions', () => {
//         it('should return all emotions', async () => {
//             // Arrange
//             const mockEmotions = [
//                 { id: 1, label: 'Joie', category: 'Positive', emoji: '😊' },
//                 { id: 2, label: 'Tristesse', category: 'Negative', emoji: '😢' }
//             ]
//             emotionRepository.findAll.mockResolvedValue(mockEmotions)

//             // Act
//             await listEmotions(req, res)

//             // Assert
//             expect(res.json).toHaveBeenCalledWith(mockEmotions)
//         })

//         it('should handle errors when listing emotions', async () => {
//             // Arrange
//             emotionRepository.findAll.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await listEmotions(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération des émotions'
//             })
//         })
//     })

//     describe('getEmotionById', () => {
//         it('should return emotion by id', async () => {
//             // Arrange
//             const mockEmotion = { id: 1, label: 'Joie', category: 'Positive', emoji: '😊' }
//             emotionRepository.findById.mockResolvedValue(mockEmotion)

//             // Act
//             await getEmotionById(req, res)

//             // Assert
//             expect(emotionRepository.findById).toHaveBeenCalledWith(1)
//             expect(res.json).toHaveBeenCalledWith(mockEmotion)
//         })

//         it('should return 404 if emotion not found', async () => {
//             // Arrange
//             emotionRepository.findById.mockResolvedValue(null)

//             // Act
//             await getEmotionById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Émotion non trouvée'
//             })
//         })

//         it('should handle errors when getting emotion by id', async () => {
//             // Arrange
//             emotionRepository.findById.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await getEmotionById(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la récupération de l\'émotion'
//             })
//         })
//     })

//     describe('createEmotion', () => {
//         it('should create a new emotion', async () => {
//             // Arrange
//             const mockEmotion = { id: 1, label: 'Joie', category: 'Positive', emoji: '😊' }
//             emotionRepository.create.mockResolvedValue(mockEmotion)

//             // Act
//             await createEmotion(req, res)

//             // Assert
//             expect(emotionRepository.create).toHaveBeenCalledWith({
//                 label: 'Joie',
//                 category: 'Positive',
//                 emoji: '😊'
//             })
//             expect(res.status).toHaveBeenCalledWith(201)
//             expect(res.json).toHaveBeenCalledWith(mockEmotion)
//         })

//         it('should handle errors when creating emotion', async () => {
//             // Arrange
//             emotionRepository.create.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await createEmotion(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(400)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la création de l\'émotion'
//             })
//         })
//     })

//     describe('updateEmotion', () => {
//         it('should update an existing emotion', async () => {
//             // Arrange
//             const mockEmotion = { id: 1, label: 'Joie Intense', category: 'Positive', emoji: '😊' }
//             emotionRepository.update.mockResolvedValue(mockEmotion)

//             // Act
//             await updateEmotion(req, res)

//             // Assert
//             expect(emotionRepository.update).toHaveBeenCalledWith(1, {
//                 label: 'Joie',
//                 category: 'Positive',
//                 emoji: '😊'
//             })
//             expect(res.json).toHaveBeenCalledWith(mockEmotion)
//         })

//         it('should handle errors when updating emotion', async () => {
//             // Arrange
//             emotionRepository.update.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await updateEmotion(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(400)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la mise à jour de l\'émotion'
//             })
//         })
//     })

//     describe('deleteEmotion', () => {
//         it('should delete an emotion', async () => {
//             // Arrange
//             emotionRepository.delete.mockResolvedValue(true)

//             // Act
//             await deleteEmotion(req, res)

//             // Assert
//             expect(emotionRepository.delete).toHaveBeenCalledWith(1)
//             expect(res.status).toHaveBeenCalledWith(204)
//             expect(res.send).toHaveBeenCalled()
//         })

//         it('should return 404 if emotion not found for deletion', async () => {
//             // Arrange
//             emotionRepository.delete.mockResolvedValue(false)

//             // Act
//             await deleteEmotion(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(404)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Émotion introuvable ou déjà supprimée'
//             })
//         })

//         it('should handle errors when deleting emotion', async () => {
//             // Arrange
//             emotionRepository.delete.mockRejectedValue(new Error('DB Error'))

//             // Act
//             await deleteEmotion(req, res)

//             // Assert
//             expect(res.status).toHaveBeenCalledWith(500)
//             expect(res.json).toHaveBeenCalledWith({
//                 error: 'Erreur lors de la suppression de l\'émotion'
//             })
//         })
//     })
// })