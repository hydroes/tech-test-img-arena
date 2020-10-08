const { MINE, CLEAR } = require('../constants/mine-field-key')
const config = require('../config')

// move this to a helper
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const placeMinesOnGrid = (grid, mineCoOrds) => {
  if (mineCoOrds.length === config.gameSettings.mines) {
    return {
      grid,
      mineCoOrds
    };
  }

  const randomXCoOrd = getRandomInt(config.gameSettings.rowWidth)
  const randomYCoOrd = getRandomInt(config.gameSettings.columnHeight)

  // try place mine
  if (grid[randomYCoOrd][randomXCoOrd] === CLEAR) {
    // create new grid with placed mine in it
    const newGrid = [...grid];
    newGrid[randomYCoOrd][randomXCoOrd] = MINE;

    // record mine location
    const mine = {
      x: randomXCoOrd,
      y: randomYCoOrd
    }
    mineCoOrds.push(mine)

    return placeMinesOnGrid(newGrid, mineCoOrds)
  }

  // otherwise try place mine again
  return placeMinesOnGrid(grid, mineCoOrds)
}

module.exports = (grid) => {
  const mineLocations = [];
  const {
    grid: gridWithMines,
    mineCoOrds
  } = placeMinesOnGrid(grid, mineLocations);

  return { gridWithMines, mineCoOrds }
}