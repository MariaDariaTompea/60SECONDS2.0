const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/steam', passport.authenticate('steam'))

router.get(
  '/steam/return',
  (req, res, next) => {
    passport.authenticate('steam', { session: false }, (err, user) => {
      if (err || !user) {
        return res.redirect(`${req.protocol}://${req.hostname}/`)
      }
      req.user = user
      next()
    })(req, res, next)
  },
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, steamId: req.user.steamId, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '28d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 28 * 24 * 60 * 60 * 1000,
    })

    res.redirect(`${req.protocol}://${req.hostname}/auth/callback?token=${token}`)
  }
)

const authMiddleware = require('../middleware/authMiddleware')
const db = require('../database/dbContext')

router.get('/me', authMiddleware, async (req, res) => {
  try {
    // a req.user.id a tokenből jön (a middleware tette be)
    const user = await db.Users.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' })
    }

    res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({ message: 'Hiba' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  })
  res.json({ message: 'Kijelentkezve' })
})

module.exports = router