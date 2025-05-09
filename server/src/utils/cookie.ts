import { CookieOptions } from 'express';
import config from '../config.js';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  sameSite: 'lax',
  path: '/',
};