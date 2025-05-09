import { CookieOptions } from 'express';
import config from '../config.js';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  ...(config.NODE_ENV === 'production' && { 
    domain: '167.235.30.231' 
  }),
  path: '/',
};