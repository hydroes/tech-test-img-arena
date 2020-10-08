const short = require('short-uuid')
const games = []

module.exports = {
  getGames: () => games,
  getGameById: id => games.find(game => game.id === id),
  addGame: data => {
    data.id = short.generate()
    games.push(data)
    return data;
  },
  updateById: (id, data) => {
    const updatedGamePos = games.map((player) => player.id).indexOf(id)
    games[updatedGamePos] = data
  }
}