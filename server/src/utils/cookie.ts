import { CookieOptions } from 'express';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  sameSite: 'lax',
};
