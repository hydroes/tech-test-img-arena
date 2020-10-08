// console.clear()
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

const t = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 9, 1, 0, 0], // mine = y = 3, x = 1 | N = x: 1, y - 1 | NE x = 2, y = 2
  [1, 2, 2, 1, 0],
  [0, 1, 9, 1, 0],
  [0, 1, 1, 1, 0],
]

// https://codesandbox.io/s/brian-gouws-rl322?file=/package.json

// players
// GET - list available players
// - start a game with player(s)
// - end game (nice to have)


// player events / tasks
// - start game  -- server generates level and read from config/setting and sends to all players

// click / play event
// - check if win/lose
// - count adjacent mines
// - each player updates the game state when they play their turn
// - share updated game state and switch turns to the other player

// @todo: overall:
// - format data store functions
// - get rid of headers already sent error

// - METHODS: reveal empty cells, add fog

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

// config will be max gridX, gridY, numOfMines
// generateGrid
// placeMines
// addMineMarkers

