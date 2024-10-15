import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      isValid: true,
      userId: payload['sub'],
      email: payload['email'],
      name: payload['name']
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { isValid: false, error: error.message };
  }
}
