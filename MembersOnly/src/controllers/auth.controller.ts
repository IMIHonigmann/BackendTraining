import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export default class AuthController {
    constructor() { }

    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const user = await User.createUser(email, password);

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'default_jwt_secret',
                { expiresIn: '24h' }
            );

            return res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'default_jwt_secret',
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}