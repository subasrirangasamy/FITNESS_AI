import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// TODO: Implement authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
