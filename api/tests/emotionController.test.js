import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEmotion } from '../controllers/emotionController.js'
import { emotionRepository } from '../repositories/EmotionRepository.js'

vi.mock('../repositories/EmotionRepository.js')

describe('emotionController.createEmotion', () => {
    let req, res

    beforeEach(() => {
        vi.clearAllMocks()
        req = {
            body: {
                label: 'Joie',
                category: 'Positive',
                emoji: '😊'
            }
        }
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
    })

    it('should return 201 and created emotion', async () => {
        const fakeEmotion = { id: 1, label: 'Joie', category: 'Positive', emoji: '😊' }
        emotionRepository.create.mockResolvedValue(fakeEmotion)

        await createEmotion(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(fakeEmotion)
    })

    it('should return 400 on error', async () => {
        emotionRepository.create.mockImplementation(() => {
            throw new Error('DB Error')
        })

        await createEmotion(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création de l’émotion' })
    })
})