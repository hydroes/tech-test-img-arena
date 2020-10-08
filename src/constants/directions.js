const N = (x, y) => ({ x, y: y - 1 })
const NE = (x, y) => ({ x: x + 1, y: y - 1 })
const E = (x, y) => ({ x: x + 1, y })
const SE = (x, y) => ({ x: x + 1, y: y + 1 })
const S = (x, y) => ({ x, y: y + 1 })
const SW = (x, y) => ({ x: x - 1, y: y + 1 })
const W = (x, y) => ({ x: x - 1, y })
const NW = (x, y) => ({ x: x - 1, y: y - 1 })

module.exports = {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW
}