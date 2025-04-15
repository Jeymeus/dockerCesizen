import bcrypt from 'bcrypt'
import { findUserByEmail, createUser } from '../models/userModel.js'
import { generateToken } from '../utils/jwt.js'

export const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Champs requis manquants' })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
        return res.status(409).json({ error: 'Email déjà utilisé' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser({ firstname, lastname, email, password: hashed, role: 'user' })

    const token = generateToken({ id: user.id, role: user.role })
    res.status(201).json({ token, user })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const token = generateToken({ id: user.id, role: user.role })
    res.json({ token, user })
}
