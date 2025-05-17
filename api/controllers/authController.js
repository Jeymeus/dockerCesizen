import bcrypt from 'bcrypt'
import { userRepository } from '../repositories/UserRepository.js'
import { generateToken, verifyToken } from '../utils/jwt.js'
import { initDB, getDB } from '../database/init.js'
import axios from 'axios'

const verifyCaptcha = async (token) => {
    const secret = process.env.RECAPTCHA_SECRET

    try {
        const res = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({
                secret,
                response: token
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        const { success, score } = res.data

        console.log('[reCAPTCHA] Résultat Google:', res.data)

        // Score minimum accepté
        const minScore = 0.5

        if (!success) return { success: false, message: 'Échec vérification reCAPTCHA' }
        if (score < minScore) {
            return { success: false, message: `Score trop bas (${score}) : possible bot` }
        }

        return { success: true, score, message: 'Tu es bien humain 🧠' }

    } catch (err) {
        console.error('[reCAPTCHA] Erreur :', err.message)
        return { success: false, message: 'Erreur serveur lors de la vérification' }
    }
}
  

// 🆕 POST /auth/register
export const register = async (req, res) => {
    await initDB()
    const { firstname, lastname, email, password, recaptchaToken } = req.body

    // ✅ Vérif captcha
    const isHuman = await verifyCaptcha(recaptchaToken)
    if (!isHuman) {
        return res.status(403).json({ error: 'Vérification anti-bot échouée (captcha)' })
    }

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    const existing = await userRepository.findByEmail(email)
    if (existing) {
        return res.status(409).json({ error: 'Email déjà utilisé' })
    }

    try {
        const hashed = await bcrypt.hash(password, 10)

        const user = await userRepository.create({
            firstname,
            lastname,
            email,
            password: hashed,
            role: req.body.role ?? 'user'
        })

        const token = generateToken({ id: user.id, role: user.role })
        res.status(201).json({ token, user })
    } catch (error) {
        console.error('[register] Erreur :', error.message)
        res.status(400).json({ error: error.message })
    }
}

// 🔑 POST /auth/login
export const login = async (req, res) => {
    await initDB()
    const { email, password, recaptchaToken } = req.body

    const isHuman = await verifyCaptcha(recaptchaToken)
    if (!isHuman) {
        return res.status(403).json({ error: 'Vérification anti-bot échouée (captcha)' })
    }

    const user = await userRepository.findByEmail(email)
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe invalide' })

    const token = generateToken({ id: user.id, role: user.role })
    res.json({ token, user })
}

// ✏️ PATCH /auth/reset-password
export const resetPassword = async (req, res) => {
    await initDB()
    const { oldPassword, newPassword } = req.body
    const userId = req.user.id

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' })
    }

    try {
        const user = await userRepository.findById(userId)
        const valid = await bcrypt.compare(oldPassword, user.password)
        if (!valid) {
            return res.status(401).json({ error: 'Ancien mot de passe incorrect' })
        }

        const hashedNew = await bcrypt.hash(newPassword, 10)
        const db = getDB()
        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(hashedNew, userId)

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' })
    }
}

// 📧 POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
    await initDB()
    const { email } = req.body

    if (!email) return res.status(400).json({ error: 'Email requis' })

    try {
        const user = await userRepository.findByEmail(email)
        if (!user) return res.status(404).json({ error: `Si l'utilisateur existe vous recevrez un lien de réinitialisation sur votre boite mail` })

        const token = generateToken({ id: user.id }, '15m')
        const resetLink = `/reset-password/${token}`

        res.json({ message: 'Lien généré', resetLink })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erreur lors de la génération du lien' })
    }
}

// 🔁 POST /auth/reset-password/:token
export const publicResetPassword = async (req, res) => {
    await initDB()
    const { token } = req.params
    const { newPassword } = req.body

    if (!newPassword) return res.status(400).json({ error: 'Nouveau mot de passe requis' })

    try {
        const decoded = verifyToken(token)
        const user = await userRepository.findById(decoded.id)
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

        const hashed = await bcrypt.hash(newPassword, 10)
        const db = getDB()
        db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(hashed, user.id)

        res.json({ message: 'Mot de passe mis à jour avec succès' })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Lien invalide ou expiré' })
    }
}
