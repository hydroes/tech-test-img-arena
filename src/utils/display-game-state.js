module.exports = (game, player, req) => ({
  gameStatus: game.state,
  // revealedGrid: game.revealedGrid.reverse()
  revealedGrid: game.revealedGrid,
  gameGrid: game.grid
})