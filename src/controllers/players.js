const store = require('../store/players')

const getPlayers = (req, res) => {
  // @todo: data validation
  const availablePlayers = store.getPlayers().filter(player => player.isPlaying === false)
  res.status(200).send(availablePlayers)
}

const addPlayer = (req, res) => {
  // @todo: validation
  // - name
  const result = store.addPlayer(req.body);
  res.status(200).send(result)
}

module.exports = {
  getPlayers,
  addPlayer
}