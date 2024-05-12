const init = require("./gameServices/game.init");
const timer = require("./gameServices/game.timer");
const dices = require("./gameServices/game.dice");
const send = require("./gameServices/game.send");
const choices = require("./gameServices/game.choice");
const grid = require("./gameServices/game.grid");
const tokens = require("./gameServices/game.token");
const score = require("./gameServices/game.score");
const end = require("./gameServices/game.end");
const util = require("./gameServices/game.util");

const GameService = {
  init,
  timer,
  dices,
  send,
  choices,
  grid,
  tokens,
  score,
  end,
  util,
};

module.exports = GameService;