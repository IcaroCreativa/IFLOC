export default function handler(req, res) {
    const responseBody = { message: 'Not authenticated.' };
    res.status(401).json(responseBody);
  }
  