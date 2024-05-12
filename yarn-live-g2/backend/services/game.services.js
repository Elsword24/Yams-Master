const init = require("./gameServices/game.init");
const timer = require("./gameServices/game.timer");
const dices = require("./gameServices/game.dice");
const send = require("./gameServices/send");
const choices = require("./gameServices/choices");
const grid = require("./gameServices/grid");
const tokens = require("./gameServices/tokens");
const score = require("./gameServices/score");
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