const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  try {
    console.log("Verifying token...");
    // Get the token from the Authorization header
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Access Denied: No token provided or incorrect format.");
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token extracted:", token);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully. Decoded payload:", decoded);
    req.user = decoded; // Attach the decoded token payload (e.g., user ID) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
