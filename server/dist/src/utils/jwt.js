import jwt from 'jsonwebtoken';
export const isTokenValid = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        throw new Error('Invalid token');
    }
    return true;
};
export const getUserIDFromToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        throw new Error('Invalid token');
    }
    return decoded.userID;
};
