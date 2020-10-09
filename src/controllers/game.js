const gameStore = require('../store/games')
const playerStore = require('../store/players')
const config = require('../config')
const generateGameGrid = require('../utils/generate-grid')
const getCoOrdInfo = require('../utils/get-grid-co-ord-info')
const { MINE, MARKER, CLEAR } = require('../constants/mine-field-legend')
const gameStates = require('../constants/game-states')
const createGrid = require('../utils/create-grid')
const displayGameState = require('../utils/display-game-state')

const createGame = (req, res) => {
  // validate players
  const players = req.body.players.map(id => {
    const player = playerStore.getPlayerById(id);
    player.isPlaying = true
    playerStore.updateById(player.id, player)
    return player
  });

  if (players.length < 2) {
    res.status(400).send('At least 2 players are required')
  }

  const gameGrid = generateGameGrid()

  const gameData = {
    players: players.map(player => player.id),
    playerCurrentTurn: players[0].id,
    createdAt: Date.now(),
    grid: gameGrid,
    gridSettings: {
      ...config.gameSettings
    },
    state: gameStates.ONGOING,
    revealedGrid: createGrid(config.gameSettings.rowWidth, config.gameSettings.columnHeight, '-')
  }

  const game = gameStore.addGame(gameData)

  console.log('-'.repeat(50), 'game', game);

  const { grid, ...gameDataWithoutGrid } = game
  res.send(gameDataWithoutGrid)
}

const playMove = (req, res) => {
  console.log('-'.repeat(50), 'req.body', req.body);
  // validate game
  const game = gameStore.getGameById(req.params.id)
  if (!game) {
    res.send('gameId not found', 404)
  }
  if (game.state === gameStates.OVER) {
    res.send('This game is over', 400)
  }

  console.log('-'.repeat(50), 'game', game);

  // validate player
  const player = playerStore.getPlayerById(req.body.player)
  if (!player) {
    res.status(404, 'playerId not found')
  }
  console.log('-'.repeat(50), 'player', player);
  // validate the player turn
  if (player.id !== game.playerCurrentTurn) {
    res.status(400).send('it is not your turn to play')
  }

  // @todo: 
  // - tally player points
  const square = getCoOrdInfo(game.grid, req.body.coOrds.x, req.body.coOrds.y)
  console.log('-'.repeat(50), 'square', square);
  switch (square) {
    case MINE:
      // @todo:
      // mark game as over
      // mark players as available so they can play other games
      // - reveal mines + revealed squares
      game.revealedGrid[req.body.coOrds.y][req.body.coOrds.x] = game.grid[req.body.coOrds.y][req.body.coOrds.x]
      game.state = gameStates.OVER
      return res.status(200).send(displayGameState(game, player, req))
    case MARKER:
      // @todo:
      // add single coOrd to revealed squares array
      // switch player turn
      // render board with revealed squares
      game.revealedGrid[req.body.coOrds.y][req.body.coOrds.x] = game.grid[req.body.coOrds.y][req.body.coOrds.x]
      return res.status(200).send(displayGameState(game, player, req))
    case CLEAR:
      // @todo:
      // calculate revealed squares
      // switch player turn
      const calculateEmptyCells = (curX, curY, alreadyVisited) => {
        // if coOrd clean then add it to revealedGrid
        const curSquare = getCoOrdInfo(game.grid, curX, curY)
        if (curSquare === CLEAN) {
          game.revealedGrid[curX][curY] = game.grid[req.body.coOrds.y][req.body.coOrds.x]
          // if empty cell then add to alreadyVisited
          alreadyVisited.push({ curX: curY })
        }
        // iterate adjacent cells:
        //  - add them revealedGrid
        //  - if adjacent are empty AND not alreadyVisited then call
      }
      console.log('-'.repeat(50), 'game.grid', game.grid);
      return res.status(200).send(displayGameState(game, player, req))
    default:
      return res.status(400).send('Invalid grid co-ordinates')
  }
}

const gameStatus = (req, res) => {
  const game = gameStore.getGameById(req.params.id)
  if (!game) {
    res.send('gameId not found', 404)
  }
  const { grid, ...gameDataWithoutGrid } = game
  res.status(200).send(gameDataWithoutGrid)
}
module.exports = {
  createGame,
  playMove,
  gameStatus
}