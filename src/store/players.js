const short = require('short-uuid');

const testPlayers = [
  {
    id: 'player1',
    name: 'player 1',
    isPlaying: false
  },
  {
    id: 'player2',
    name: 'player 2',
    isPlaying: false
  },
  {
    id: 'player3',
    name: 'player 3',
    isPlaying: false
  }
]

const players = [...testPlayers]

module.exports = {
  getPlayers: () => players,
  getPlayerById: (id) => players.find(player => player.id === id),
  addPlayer: (data) => {
    data.id = short.generate()
    data.isPlaying = false
    players.push(data)
    return data;
  },
  updateById: (id, data) => {
    const updatedPlayerPos = players.map((player) => player.id).indexOf(id)
    players[updatedPlayerPos] = data
  }
}