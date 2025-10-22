"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/User';
const router = express_1.default.Router();
// TODO: Implement authentication routes
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        // const { name, email, password } = req.body;
        // 
        // // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // 
        // // Create user
        // const user = await User.create({
        //   name,
        //   email,
        //   password: hashedPassword
        // });
        // 
        // // Generate JWT
        // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
        // 
        // res.status(201).json({ user, token });
        res.status(501).json({ message: 'Register endpoint not implemented yet' });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        // const { email, password } = req.body;
        // 
        // // Find user
        // const user = await User.findOne({ email });
        // if (!user) {
        //   return res.status(401).json({ error: 'Invalid credentials' });
        // }
        // 
        // // Verify password
        // const isValid = await bcrypt.compare(password, user.password);
        // if (!isValid) {
        //   return res.status(401).json({ error: 'Invalid credentials' });
        // }
        // 
        // // Generate JWT
        // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
        // 
        // res.json({ user, token });
        res.status(501).json({ message: 'Login endpoint not implemented yet' });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map