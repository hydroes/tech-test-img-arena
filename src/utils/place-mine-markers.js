const adjacentCells = require('../constants/directions')
const { MINE } = require('../constants/mine-field-key')

const t = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 9, 1, 0, 0], // mine = y = 3, x = 1 | N = x: 1, y - 1 | NE x = 2, y = 2
  [1, 2, 2, 1, 0],
  [0, 1, 9, 1, 0],
  [0, 1, 1, 1, 0],
]

const isValidMarker = (gridWithMines, x, y) => {
  if (gridWithMines[y] === undefined
    || gridWithMines[y][x] === undefined
    || gridWithMines[y][x] === MINE) {
    return false;
  }
  return true;
}

const placeMarkers = (gridWithMines, mineCoOrds) => {
  const gridWithMarkers = [...gridWithMines]

  mineCoOrds.forEach((mine) => {
    // iterate over adjacent cells and increment if valid
    // console.log('-'.repeat(50), 'mine', mine);
    // go thru mine adjacent cells
    for (const [key, adjacentCellDirection] of Object.entries(adjacentCells)) {
      // console.log('-'.repeat(50), `${key}: ${adjacentCellDirection}`);
      let cellDirectionCoOrds = adjacentCellDirection(mine.x, mine.y)
      if (isValidMarker(gridWithMarkers, cellDirectionCoOrds.x, cellDirectionCoOrds.y) !== false) {
        gridWithMarkers[cellDirectionCoOrds.y][cellDirectionCoOrds.x] += 1
      }
    }
  })

  return gridWithMarkers
}

module.exports = (gridWithMines, mineCoOrds) => {
  // go through adjacent cells and check if cell is valid, if so then increment cell counts
  const gridWithMarkers = placeMarkers(gridWithMines, mineCoOrds)
  return gridWithMarkers
}