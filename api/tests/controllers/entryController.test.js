// api/tests/controllers/entryController.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    addEntry,
    editEntry,
    removeEntry,
    listMyEntries,
    getEntryById,
    getMyReport
} from '../controllers/entryController.js'
import { entryRepository } from '../repositories/EntryRepository.js'

vi.mock('../repositories/EntryRepository.js')

describe('EntryController', () => {
    let req, res

    beforeEach(() => {
        vi.clearAllMocks()
        req = {
            params: { id: 1 },
            body: {
                emotion_id: 1,
                note: 'Test note',
                date_entry: '2024-01-15'
            },
            user: { id: 1 },
            query: { start: '2024-01-01', end: '2024-01-31' }
        }
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            send: vi.fn()
        }
    })

    describe('addEntry', () => {
        it('should add a new entry', async () => {
            // Arrange
            const mockEntry = {
                id: 1,
                user_id: 1,
                emotion_id: 1,
                note: 'Test note',
                date_entry: '2024-01-15'
            }
            entryRepository.create.mockResolvedValue(mockEntry)

            // Act
            await addEntry(req, res)

            // Assert
            expect(entryRepository.create).toHaveBeenCalledWith({
                user_id: 1,
                emotion_id: 1,
                note: 'Test note',
                date_entry: '2024-01-15'
            })
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(mockEntry)
        })

        it('should return 400 if required fields are missing', async () => {
            // Arrange
            req.body.emotion_id = null

            // Act
            await addEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Emotion ID et date d\'entrée requis'
            })
        })

        it('should handle errors when adding entry', async () => {
            // Arrange
            entryRepository.create.mockRejectedValue(new Error('DB Error'))

            // Act
            await addEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de l\'ajout d\'une émotion au journal'
            })
        })
    })

    describe('editEntry', () => {
        it('should edit an existing entry', async () => {
            // Arrange
            const existingEntry = { id: 1, user_id: 1, emotion_id: 1, note: 'Old note' }
            const updatedEntry = { id: 1, user_id: 1, emotion_id: 2, note: 'Updated note' }

            entryRepository.findById.mockResolvedValue(existingEntry)
            entryRepository.update.mockResolvedValue(updatedEntry)

            // Act
            await editEntry(req, res)

            // Assert
            expect(entryRepository.findById).toHaveBeenCalledWith(1)
            expect(entryRepository.update).toHaveBeenCalledWith(1, {
                emotion_id: 1,
                note: 'Test note',
                date_entry: '2024-01-15'
            })
            expect(res.json).toHaveBeenCalledWith(updatedEntry)
        })

        it('should return 403 if entry does not belong to user', async () => {
            // Arrange
            const existingEntry = { id: 1, user_id: 2, emotion_id: 1, note: 'Old note' }
            entryRepository.findById.mockResolvedValue(existingEntry)

            // Act
            await editEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Accès interdit ou entrée inexistante'
            })
        })

        it('should return 403 if entry does not exist', async () => {
            // Arrange
            entryRepository.findById.mockResolvedValue(null)

            // Act
            await editEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Accès interdit ou entrée inexistante'
            })
        })

        it('should handle errors when editing entry', async () => {
            // Arrange
            entryRepository.findById.mockRejectedValue(new Error('DB Error'))

            // Act
            await editEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la modification de l\'entrée'
            })
        })
    })

    describe('removeEntry', () => {
        it('should remove an entry', async () => {
            // Arrange
            const existingEntry = { id: 1, user_id: 1, emotion_id: 1, note: 'Test note' }
            entryRepository.findById.mockResolvedValue(existingEntry)
            entryRepository.delete.mockResolvedValue(true)

            // Act
            await removeEntry(req, res)

            // Assert
            expect(entryRepository.findById).toHaveBeenCalledWith(1)
            expect(entryRepository.delete).toHaveBeenCalledWith(1)
            expect(res.status).toHaveBeenCalledWith(204)
            expect(res.send).toHaveBeenCalled()
        })

        it('should return 403 if entry does not belong to user', async () => {
            // Arrange
            const existingEntry = { id: 1, user_id: 2, emotion_id: 1, note: 'Test note' }
            entryRepository.findById.mockResolvedValue(existingEntry)

            // Act
            await removeEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Accès interdit ou entrée inexistante'
            })
        })

        it('should return 404 if entry could not be deleted', async () => {
            // Arrange
            const existingEntry = { id: 1, user_id: 1, emotion_id: 1, note: 'Test note' }
            entryRepository.findById.mockResolvedValue(existingEntry)
            entryRepository.delete.mockResolvedValue(false)

            // Act
            await removeEntry(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Entrée introuvable ou déjà supprimée'
            })
        })
    })

    describe('listMyEntries', () => {
        it('should list user entries', async () => {
            // Arrange
            const mockEntries = [
                { id: 1, user_id: 1, emotion_id: 1, note: 'Entry 1' },
                { id: 2, user_id: 1, emotion_id: 2, note: 'Entry 2' }
            ]
            entryRepository.findByUser.mockResolvedValue(mockEntries)

            // Act
            await listMyEntries(req, res)

            // Assert
            expect(entryRepository.findByUser).toHaveBeenCalledWith(1)
            expect(res.json).toHaveBeenCalledWith(mockEntries)
        })

        it('should handle errors when listing entries', async () => {
            // Arrange
            entryRepository.findByUser.mockRejectedValue(new Error('DB Error'))

            // Act
            await listMyEntries(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la récupération du journal'
            })
        })
    })

    describe('getEntryById', () => {
        it('should get entry by id', async () => {
            // Arrange
            const mockEntry = { id: 1, user_id: 1, emotion_id: 1, note: 'Test note' }
            entryRepository.findById.mockResolvedValue(mockEntry)

            // Act
            await getEntryById(req, res)

            // Assert
            expect(entryRepository.findById).toHaveBeenCalledWith(1)
            expect(res.json).toHaveBeenCalledWith(mockEntry)
        })

        it('should return 403 if entry does not belong to user', async () => {
            // Arrange
            const mockEntry = { id: 1, user_id: 2, emotion_id: 1, note: 'Test note' }
            entryRepository.findById.mockResolvedValue(mockEntry)

            // Act
            await getEntryById(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Accès interdit ou entrée introuvable'
            })
        })
    })

    describe('getMyReport', () => {
        it('should generate user report', async () => {
            // Arrange
            const mockReport = [
                { category: 'Joie', label: 'Bonheur', count: 5 },
                { category: 'Tristesse', label: 'Mélancolie', count: 2 }
            ]
            entryRepository.getReportByPeriod.mockResolvedValue(mockReport)

            // Act
            await getMyReport(req, res)

            // Assert
            expect(entryRepository.getReportByPeriod).toHaveBeenCalledWith(1, '2024-01-01', '2024-01-31')
            expect(res.json).toHaveBeenCalledWith(mockReport)
        })

        it('should return 400 if start or end date is missing', async () => {
            // Arrange
            req.query.start = null

            // Act
            await getMyReport(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Dates de début et de fin requises (start, end)'
            })
        })

        it('should handle errors when generating report', async () => {
            // Arrange
            entryRepository.getReportByPeriod.mockRejectedValue(new Error('DB Error'))

            // Act
            await getMyReport(req, res)

            // Assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Erreur lors de la génération du rapport'
            })
        })
    })
})