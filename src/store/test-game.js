const gameStates = require('../constants/game-states')
const createGrid = require('../utils/create-grid')
const config = require('../config')

module.exports = {
  "players": [
    "player3",
    "player4"
  ],
  "playerCurrentTurn": "player3",
  "createdAt": Date.now(),
  "grid": [
    [1, 1, 1, 0],
    [2, 9, 2, 0],
    [2, 9, 2, 0],
    [1, 1, 1, 0]
  ],
  "gridSettings": {
    "rowWidth": 4,
    "columnHeight": 4,
    "mines": 2
  },
  "id": "test-game",
  state: gameStates.ONGOING,
  revealedGrid: createGrid(config.gameSettings.rowWidth, config.gameSettings.columnHeight, '-')
}