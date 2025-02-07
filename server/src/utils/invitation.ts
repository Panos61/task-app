import crypto from 'crypto';

export const generateInvitationCode = () => {
  return crypto
    .randomBytes(Math.ceil(12 / 2))
    .toString('hex')
    .slice(0, 12);
};
