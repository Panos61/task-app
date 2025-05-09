import { CookieOptions } from 'express';
import config from '../config.js';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  sameSite: 'none',
};
