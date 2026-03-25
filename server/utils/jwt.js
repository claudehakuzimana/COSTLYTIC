import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

export const generateToken = (payload, expiresIn = env.jwtExpiresIn) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default { generateToken, verifyToken, decodeToken };
