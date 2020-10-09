const { MINE, CLEAR } = require('../constants/mine-field-legend')
const adjacentCells = require('../constants/directions')
const config = require('../config')
const createGrid = require('./create-grid')

// @todo: move this to a helper
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

const placeMines = (grid) => {
  const mineLocations = [];
  const {
    grid: gridWithMines,
    mineCoOrds
  } = placeMinesOnGrid(grid, mineLocations);

  return { gridWithMines, mineCoOrds }
}

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

const placeMineMarkers = (gridWithMines, mineCoOrds) => {
  // go through adjacent cells and check if cell is valid, if so then increment cell counts
  const gridWithMarkers = placeMarkers(gridWithMines, mineCoOrds)
  return gridWithMarkers
}

module.exports = () => {
  const emptyGrid = createGrid(config.gameSettings.rowWidth, config.gameSettings.columnHeight, 0)
  const { gridWithMines, mineCoOrds } = placeMines(emptyGrid);
  const gridWithMarkers = placeMineMarkers(gridWithMines, mineCoOrds)
  return gridWithMarkers
}