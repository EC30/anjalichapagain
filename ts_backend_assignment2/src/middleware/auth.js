const jwt = require('jsonwebtoken');
// const db = require('./src/db/db');

const authMiddleware = async (req, res, next) => {
    console.log('auth');
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }
    // Split the token correctly
    const bearer = token.split(" ");
    
    if (bearer.length !== 2) {
      return res.status(401).json({ error: 'Invalid access token format' });
    }
    req.token = bearer[1]; 

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if (err) {
          return res.status(401).json(err);
          // return res.status(403).json({ error: 'Invalid access token' });
        } else {
        //   res.json({
            // message: "user accessed",
            // authData
        //   });
        }
      });
    next();
};

module.exports = authMiddleware;