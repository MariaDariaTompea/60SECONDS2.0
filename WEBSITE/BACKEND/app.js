const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('./api/config/passport')
require('dotenv').config()

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://www.captiansgamble.com',
  'https://captiansgamble.com',
  'http://www.captiansgamble.com',
  'http://captiansgamble.com',
  'http://192.168.1.244',
  'http://192.168.1.244:5173',
]

const characterRoute = require("./api/routes/characterRoutes.js");
const itemRoute = require("./api/routes/itemRoutes.js");
const newsRoute = require("./api/routes/newsRoutes.js");
const authRoutes = require('./api/routes/authRoutes');
const communityRoute = require("./api/routes/communityRoutes.js");

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use("/character", characterRoute);
app.use("/item", itemRoute);
app.use("/news", newsRoute);
app.use('/auth', authRoutes);
app.use("/community", communityRoute);

module.exports = app;