const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('token');
    if (!token) return res.status(401).json({ error: 'Plese provide a token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

  

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Role is not exist' });
      }

      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };
};

module.exports = auth;
