import { CookieOptions } from 'express';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: false,
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  sameSite: 'lax',
  path: '/',
};