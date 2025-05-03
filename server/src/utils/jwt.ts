import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '@/config.js';

export const isTokenValid = (token: string): boolean => {
  const decoded = jwt.verify(token, config.JWT_SECRET!);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  return true;
};

export const getUserIDFromToken = (token: string): string => {
  const decoded = jwt.verify(token, config.JWT_SECRET!) as JwtPayload;
  if (!decoded) {
    throw new Error('Invalid token');
  }

  return decoded.userID;
};
