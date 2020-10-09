const { MINE, CLEAR, MARKER, INVALID } = require('../constants/mine-field-legend')
module.exports = (grid, x, y) => {
  if (grid[y] === undefined || grid[y][x] === undefined) {
    return INVALID;
  }

  const squareVal = grid[y][x]
  switch (squareVal) {
    case MINE:
      return MINE
    case CLEAR:
      return CLEAR
    default:
      return MARKER
  }
}