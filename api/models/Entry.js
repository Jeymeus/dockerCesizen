import BaseModel from './BaseModel.js'

export default class Entry extends BaseModel {
    constructor(data) {
        super('entries')

        if (
            typeof data !== 'object' || data === null ||
            !('id' in data) ||
            !('user_id' in data) ||
            !('emotion_id' in data) ||
            !('date_entry' in data)
        ) {
            throw new Error('[Entry] Données invalides : id, user_id, emotion_id et date_entry sont requis')
        }

        this.id = Number(data.id)
        this.user_id = Number(data.user_id)
        this.emotion_id = Number(data.emotion_id)
        this.note = 'note' in data ? String(data.note ?? '') : ''
        this.date_entry = String(data.date_entry)
        this.created_at = data.created_at ?? new Date().toISOString()
        this.updated_at = data.updated_at ?? null
    }

    get formattedDate() {
        return new Date(this.date_entry).toLocaleDateString('fr-FR')
    }
}
