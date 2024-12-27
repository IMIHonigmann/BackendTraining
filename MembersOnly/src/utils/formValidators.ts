import { body, validationResult } from 'express-validator'

export const registerValidationRules = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)                       // Must contain number
        .matches(/[A-Z]/)                   // Must contain uppercase
        .matches(/[a-z]/)                   // Must contain lowercase
        .matches(/[^A-Za-z0-9]/)           // Must contain special char
        .not().contains(' ')
        .withMessage('Password must contain at least one letter, one number and one special character')
]

export function validateRegister(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}