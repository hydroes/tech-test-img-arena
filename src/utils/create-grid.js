// x = horizontal, y = vertical
module.exports = (gridMaxX, GridMaxY, fillGridWithDefaultValue = 0) => {
  // create a multi dimensional array
  return Array(GridMaxY).fill().map((_, y) => {
    return Array(gridMaxX).fill().map((_, x) => fillGridWithDefaultValue)
  });

}