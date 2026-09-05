import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../firebase-admin';

export interface AuthenticatedRequest extends Request {
  user?: { uid: string; email?: string };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
