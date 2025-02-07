import jwt, { JwtPayload } from 'jsonwebtoken';

export const isTokenValid = (token: string): boolean => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  return true;
};

export const getUserIDFromToken = (token: string): string => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!decoded) {
    throw new Error('Invalid token');
  }

  return decoded.userID;
};
