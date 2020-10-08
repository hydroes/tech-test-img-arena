const gameStore = require('../store/games')
const playerStore = require('../store/players')

const config = require('../config')
const initGrid = require('../utils/create-empty-grid')
const placeMines = require('../utils/place-mines-on-grid')
const placeMineMarkers = require('../utils/place-mine-markers')
const generateGameGrid = require('../utils/generate-grid')

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

  // // create a grid
  // const initialGrid = initGrid(config.gameSettings.rowWidth, config.gameSettings.columnHeight);
  // // place mines on grid and get mine coOrds
  // const { gridWithMines, mineCoOrds } = placeMines(initialGrid, config);
  // // place mine markers
  // const gridWithMarkers = placeMineMarkers(gridWithMines, mineCoOrds)
  const gameGrid = generateGameGrid()

  const gameData = {
    players: players.map(player => player.id),
    playerCurrentTurn: players[0].id,
    createdAt: Date.now(),
    grid: gameGrid,
    gridSettings: {
      ...config.gameSettings
    }
  }

  const game = gameStore.addGame(gameData)

  console.log('-'.repeat(50), 'game', game);

  const { grid, ...gameDataWithoutGrid } = game
  res.send(gameDataWithoutGrid)
}

const playMove = (req, res) => {
  // @todo: validation
  // valid move co-ords
  const game = gameStore.getGameById(req.params.id)
  if (!game) {
    res.send('gameId not found', 404)
  }
  res.status(200).send(game)
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