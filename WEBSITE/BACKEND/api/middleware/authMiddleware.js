const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token   // a cookie-ból (a cookie-parser miatt elérhető)

  if (!token) {
    return res.status(401).json({ message: 'Nincs bejelentkezve' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded   // a token payload (id, steamId, role)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Érvénytelen token' })
  }
}

module.exports = authMiddleware