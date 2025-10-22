"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// TODO: Implement authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        // const token = req.headers.authorization?.split(' ')[1];
        // 
        // if (!token) {
        //   return res.status(401).json({ error: 'No token provided' });
        // }
        // 
        // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
        // 
        // // Attach user to request
        // req.user = { id: decoded.userId, email: '' };
        // 
        // next();
        res.status(501).json({ error: 'Authentication not implemented yet' });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map