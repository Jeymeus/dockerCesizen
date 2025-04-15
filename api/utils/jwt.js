import jwt from 'jsonwebtoken'

const SECRET = 'supersecret' // remplace par une vraie clé en prod

export const generateToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET)
}
