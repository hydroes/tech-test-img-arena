const express = require('express')
const app = express()
const config = require('./config')

app.use(express.json());

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const { players, game } = require('./controllers/')

// routes
// player
app.get('/players', players.getPlayers)
app.post('/players', players.addPlayer)

// game
app.post('/game', game.createGame)
app.post('/game/:id/move', game.playMove)
app.get('/game/:id', game.gameStatus)

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})

// @todo: overall:
// - format data store functions
// - objects are modified by reference, be wary!

// -------- REST ENDPOINTS ---------
// - players
// - GET - available players
// - POST - create player
// - DELETE - player

// GAME
// - GET - game status (grid, turn info, gameStatus (timer))
// - POST - create new game (needs players)
// - POST /move - x, y of co-rds move to play
// - DELETE - game


