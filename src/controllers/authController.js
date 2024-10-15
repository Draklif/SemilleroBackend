import { verifyGoogleToken } from '../utils/googleAuth.js';

export const login = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'No token provided. Unauthorized.' });
  }

  const result = await verifyGoogleToken(token);

  if (!result.isValid) {
    return res.status(401).send({ message: 'Invalid Google token.' });
  }

  res.send({
    message: 'Login successful',
    user: {
      userId: result.userId,
      email: result.email,
      name: result.name,
    },
  });
};
