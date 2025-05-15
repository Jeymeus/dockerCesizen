import { body, validationResult } from 'express-validator'

export const validateRegister = [
    body('firstname')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),

    body('lastname')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

    body('email')
        .normalizeEmail()
        .isEmail().withMessage("L'adresse email est invalide"),

    body('password')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Champs invalides',
                details: errors.array()
            })
        }
        next()
    }
]
