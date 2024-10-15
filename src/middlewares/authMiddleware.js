import { verifyGoogleToken } from '../utils/googleAuth.js';

export const validate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized. Please log in.' });
  }

  const result = await verifyGoogleToken(token);
  if (!result.isValid) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // You could attach user info to the request if needed:
  req.user = result;

  next();
};