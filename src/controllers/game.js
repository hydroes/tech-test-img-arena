const gameStore = require('../store/games')
const playerStore = require('../store/players')
const config = require('../config')
const generateGameGrid = require('../utils/generate-grid')
const getCoOrdInfo = require('../utils/get-grid-co-ord-info')
const { MINE, MARKER, CLEAR } = require('../constants/mine-field-legend')
const gameStates = require('../constants/game-states')
const createGrid = require('../utils/create-grid')
const displayGameState = require('../utils/display-game-state')
const adjacentCells = require('../constants/directions')

// @todo: move this to a utility 
const isValidCell = (grid, x, y) => {
  if (grid[y] === undefined || grid[y][x] === undefined) {
    return false;
  }
  return true;
}

const createGame = (req, res) => {
  // validate players
  const players = req.body.players.map(id => {
    const player = playerStore.getPlayerById(id);
    player.isPlaying = true
    playerStore.updateById(player.id, player)
    return player
  });

  if (players.length !== 2) {
    res.status(400).send('Only 2 players currently supported')
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
  const { grid, ...gameDataWithoutGrid } = game
  res.send(displayGameState(game))
}

const playMove = (req, res) => {
  // validate game
  const game = gameStore.getGameById(req.params.id)
  if (!game) {
    return res.send('gameId not found', 404)
  }
  if (game.state === gameStates.OVER) {
    return res.send('This game is over', 400)
  }

  // validate player
  const player = playerStore.getPlayerById(req.body.player)
  if (!player) {
    return res.status(404, 'playerId not found')
  }

  // validate the player turn
  if (player.id !== game.playerCurrentTurn) {
    return res.status(400).send('it is not your turn to play')
  }

  // @todo: 
  // - tally player points
  const square = getCoOrdInfo(game.grid, req.body.coOrds.x, req.body.coOrds.y)
  switch (square) {
    case MINE:
      // @todo:
      // toggle player
      game.playerCurrentTurn = game.players.find(p => p !== player.id)
      // mark players as available so they can play other games
      game.revealedGrid[req.body.coOrds.y][req.body.coOrds.x] = game.grid[req.body.coOrds.y][req.body.coOrds.x]
      game.state = gameStates.OVER
      return res.status(200).send(displayGameState(game, player, req))
    case MARKER:
      // toggle player
      game.playerCurrentTurn = game.players.find(p => p !== player.id)
      game.revealedGrid[req.body.coOrds.y][req.body.coOrds.x] = game.grid[req.body.coOrds.y][req.body.coOrds.x]
      return res.status(200).send(displayGameState(game, player, req))
    case CLEAR:
      // toggle player
      game.playerCurrentTurn = game.players.find(p => p !== player.id)
      const calculateEmptyCells = (curX, curY, alreadyVisited) => {
        const curSquareType = getCoOrdInfo(game.grid, curX, curY)
        if (curSquareType === CLEAR) {
          // add coOrd to revealed grid
          game.revealedGrid[curY][curX] = game.grid[curY][curX]
          // if empty cell then add to alreadyVisited
          alreadyVisited.push({ x: curX, y: curY })
        }
        // iterate adjacent cells:
        for (const [key, adjacentCellDirection] of Object.entries(adjacentCells)) {
          let adjacentCellCoOrds = adjacentCellDirection(curX, curY)
          if (isValidCell(game.grid, adjacentCellCoOrds.x, adjacentCellCoOrds.y) === true) {
            let adjacentCellInfo = getCoOrdInfo(game.grid, adjacentCellCoOrds.x, adjacentCellCoOrds.y)

            if (adjacentCellInfo === MARKER) {
              game.revealedGrid[adjacentCellCoOrds.y][adjacentCellCoOrds.x] = game.grid[adjacentCellCoOrds.y][adjacentCellCoOrds.x]
            }

            let hasBeenVisited = alreadyVisited.find((visitedCoOrd) => {
              return visitedCoOrd.x === adjacentCellCoOrds.x && visitedCoOrd.y === adjacentCellCoOrds.y
            })
            //  - if adjacent are empty AND !hasBeenVisited 
            if (adjacentCellInfo === CLEAR && hasBeenVisited === undefined) {
              calculateEmptyCells(adjacentCellCoOrds.x, adjacentCellCoOrds.y, alreadyVisited)
            }
          }
        }
      }
      calculateEmptyCells(req.body.coOrds.x, req.body.coOrds.y, [])
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