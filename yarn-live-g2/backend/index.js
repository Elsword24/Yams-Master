const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var uniqid = require("uniqid");
const GameService = require("./services/game.services");

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------
let games = [];
let queue = [];
// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------
const newPlayerInQueue = (socket) => {
  queue.push(socket);
  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket);
  } else {
    socket.emit("queue.added", GameService.send.forPlayer.viewQueueState());
  }
};
const updateClientsViewTimers = (game) =>  {
  game.player1Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:1', game.gameState));
  game.player2Socket.emit('game.timer', GameService.send.forPlayer.gameTimer('player:2', game.gameState));
};

const updateClientsViewDecks = (game) => {
  setTimeout(()=>{
    game.player1Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:1', game.gameState));
    game.player2Socket.emit('game.deck.view-state', GameService.send.forPlayer.deckViewState('player:2', game.gameState));
  }, 200);
};

const createGame = (player1Socket, player2Socket) => {
  const newGame = GameService.init.gameState();
  newGame["idGame"] = uniqid();
  newGame["player1Socket"] = player1Socket;
  newGame["player2Socket"] = player2Socket;
  games.push(newGame);
  const gameIndex = GameService.utils.findGameIndexById(games, newGame.idGame);

  // On execute une fonction toutes les secondes (1000 ms)
  const gameInterval = setInterval(() => {
    games[gameIndex].gameState.timer--;

    // Si le timer tombe à zéro
if (games[gameIndex].gameState.timer === 0) {
  // On change de tour en inversant le clé dans 'currentTurn'
  games[gameIndex].gameState.currentTurn = games[gameIndex].gameState.currentTurn === 'player:1' ? 'player:2' : 'player:1';
  // Méthode du service qui renvoie la constante 'TURN_DURATION'
  games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

  games[gameIndex].gameState.deck = GameService.init.deck();

  updateClientsViewDecks(games[gameIndex]);
  };

  // On notifie finalement les clients que les données sont mises à jour.
  updateClientsViewTimers(games[gameIndex]);

  }, 1000);

  updateClientsViewDecks(games[gameIndex]);

  games[gameIndex].player1Socket.emit("game.start", GameService.send.forPlayer.viewGameState("player:1", games[gameIndex]));
  games[gameIndex].player2Socket.emit("game.start", GameService.send.forPlayer.viewGameState("player:2", games[gameIndex]));

  // On prévoit de couper l'horloge
  // pour le moment uniquement quand le socket se déconnecte
  player1Socket.on("disconnect", () => {
    clearInterval(gameInterval);
  });
  player2Socket.on("disconnect", () => {
    clearInterval(gameInterval);
  });
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------
io.on("connection", (socket) => {
  console.log(`[${socket.id}] socket connected`);
  socket.on("queue.join", () => {
    console.log(`[${socket.id}] new player in queue `);
    newPlayerInQueue(socket);
  });
  socket.on('game.dices.roll', () => {
    const gameIndex = GameService.utils.findGameIndexBySocketId(games, socket.id);

    games[gameIndex].gameState.deck.dices = GameService.dices.roll(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.deck.rollsCounter++;

    if (games[gameIndex].gameState.deck.rollsCounter < (games[gameIndex].gameState.deck.rollsMaximum)){
      games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(games[gameIndex].gameState.deck.dices);
      games[gameIndex].gameState.timer =5;
    }

    updateClientsViewDecks(games[gameIndex]);
  }); 
  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});
// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------
app.get("/", (req, res) => res.sendFile("index.html"));
http.listen(3000, function () {
  console.log("listening on *:3000");
});
