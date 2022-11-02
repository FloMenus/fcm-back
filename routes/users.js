const express = require('express')
const app = express()
const passport = require('../config/passport')

app.get('/me', passport.authenticate('jwt'), (req, res) => {
  res.json(req.user)
})

app.get('/secured', passport.authenticate('jwt'), (req, res) => {
  res.json({
    message: 'secured'
  })
})

module.exports = app