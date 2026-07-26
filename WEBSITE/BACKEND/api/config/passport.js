const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy
const db = require('../database/dbContext')

passport.use(
  new SteamStrategy(
    {
      returnURL: `${process.env.BACKEND_URL}/auth/steam/return`,
      realm: `${process.env.BACKEND_URL}/`,
      apiKey: process.env.STEAM_API_KEY,
    },
    async (identifier, profile, done) => {
      try {
        const steamId = profile.id

        let user = await db.Users.findOne({ where: { steamId } })

        if (!user) {
          user = await db.Users.create({
            steamId: steamId,
            username: profile.displayName,
            avatar: profile.photos?.[2]?.value || profile.photos?.[0]?.value || null,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport