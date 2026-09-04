const jwt = require('jsonwebtoken');

function verifierToken(req, res, next) { //NEXT  autorise à passer à la suite
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1]; // la convention des tokens est -> "Bearer eyJhbGciOiJIUzI1Ni..." on va séparer les diffenrents mots et on garde seulement le deuxième ( 1 )  

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

module.exports = verifierToken;