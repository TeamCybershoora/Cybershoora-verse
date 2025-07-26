import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'shoora_secret';

export function signJwt(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
} 