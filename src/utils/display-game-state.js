module.exports = (game, player, req) => ({
  gameStatus: game.state,
  revealedGrid: game.revealedGrid,
  currentPlayerTurn: game.currentPlayerTurn
})